import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { spacing, uiStyles } from '@/constants/Styles';
import { colorPalette } from '@/constants/Colors';
import LogoImage from '@/assets/images/logo/Logo_Isolated_2x.png';
import db from '@/db/db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { mixes as mixesTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import SunsetSunriseMessage from '@/components/SunsetSunriseMessage';

export default function HomeScreen() {
  const { data } = useLiveQuery(db.select().from(mixesTable));
  const mixes = data || [];

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={[
          uiStyles.mainContentPadding,
          styles.header,
        ]}>
          <View style={styles.headerAppName}>
            <Image source={LogoImage} style={styles.logoIcon} />
            <ThemedText style={styles.appTitle}>Smooth Noise</ThemedText>
          </View>
          <SunsetSunriseMessage />
        </View>
        {/* <View style={styles.section}>
          <ThemedText type="subtitle">Get Started</ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">Jump back in</ThemedText>
        </View> */}
        <View style={[
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

        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacing.xl,
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
    color: colorPalette.zinc[200],
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
