import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { spacing, uiStyles } from '@/constants/Styles';
import { colorPalette } from '@/constants/Colors';
import LogoImage from '@/assets/images/logo/Logo_Isolated_2x.png';
import db from '@/db/db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { userGoals as userGoalsTable, loggedFoodItems as loggedFoodItemsTable } from '@/db/schema';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { data: userGoals } = useLiveQuery(db.select().from(userGoalsTable));
  const { data: loggedFoodItems } = useLiveQuery(db.select().from(loggedFoodItemsTable));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={[
          uiStyles.mainContentPadding,
          styles.container
        ]}>
          <View style={styles.header}>
            <View style={styles.headerAppName}>
              <Image source={LogoImage} style={styles.logoIcon} />
              <ThemedText style={styles.appTitle}>Nutrition Pal</ThemedText>
            </View>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle" centered>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Daily Goal</ThemedText>
            <ThemedText>daily goal here...</ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Today's log</ThemedText>
            <ThemedText>today's log here...</ThemedText>
          </View>
          {/* <View style={[
          styles.section,
        ]}>
          <View style={[
            styles.sectionHeader,
            uiStyles.mainContentPadding
          ]}>
            <ThemedText type="subtitle" style={[
              styles.sectionTitle,
            ]}>Nature Mixes</ThemedText>
            <ThemedText muted>Mixes with the soothing sounds of nature</ThemedText>
          </View>

        </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerAppName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'column',
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  sectionTitle: {

  },
  tilesContainer: {
    flexDirection: 'row',
  },
});
