import 'react-native-gesture-handler'; // Must be at the top
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Appearance, View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/state/store';
import { getUser } from '@/lib/auth-utils';
import { fetchUserGoals, fetchLoggedFoodItems, fetchChatMessages } from '@/lib/api-fetch';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import db from '@/db/db';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Appearance.setColorScheme('light'); // Forces dark mode globally

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { currentUser, currentUserHasBeenFetched, isOffline, setIsOffline } = useAppStore();

  useEffect(() => {
    if (loaded) {
      if (currentUser) {
        router.replace('/(tabs)');
      }
      SplashScreen.hideAsync();
    }
  }, [loaded, router]);

  useEffect(() => {
    if (!currentUser) {
      getUser();
    }
  }, [currentUser, getUser]);

  useEffect(() => {
    if (!currentUser) return;

    fetchUserGoals();
    fetchLoggedFoodItems();
    fetchChatMessages();
  }, [currentUser]);

  const { success, error } = useMigrations(db, migrations);
  if (error) {
    console.error('Error running migrations:', error);
    return (
      <View>
        <Text>Error running migrations:</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: 'none'
            }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="auth-modal"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="set-goals-modal"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="nutrition-assistant-modal"
            options={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
