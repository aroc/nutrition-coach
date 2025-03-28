import { router, Tabs, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import PikaHomeDefault from '@/components/icons/pika/solid/home-default';
import PikaUserDefault from '@/components/icons/pika/solid/user-default';
import PikaNotebook from '@/components/icons/pika/solid/notebook';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/state/store';

const AssistantButton = ({ color }: { color: string }) => (
  <View
    style={{
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#34D399',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
    }}>
    <PikaNotebook color="white" />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              borderTopWidth: 0,
              paddingTop: 10,
              backgroundColor: 'white',
              paddingBottom: 60,
            },
            default: {
              paddingBottom: 60,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <PikaHomeDefault
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="assistant"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push('/nutrition-assistant-modal');
            },
          }}
          options={{
            title: 'Assistant',
            tabBarIcon: ({ color }) => <AssistantButton color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <PikaUserDefault
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
