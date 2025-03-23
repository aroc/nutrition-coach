import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { spacing, uiStyles } from '@/constants/Styles';
import { colorPalette } from '@/constants/Colors';
import LogoImage from '@/assets/images/logo/Logo_Isolated_2x.png';
import BigTile from '@/components/BigTile';
import { setMixAsNowPlaying } from '@/lib/audio-manager-utils';
import db from '@/db/db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { mixes as mixesTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import SunsetSunriseMessage from '@/components/SunsetSunriseMessage';

type SuggestedMix = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
};

const suggestedMixes: SuggestedMix[] = [
  {
    id: "669404a5-7af4-48c2-9e1c-f06bdc1c3e59",
    title: 'Rain on the mountain',
    category: 'Nature',
    description: 'A mix of smooth noise',
    imageUrl: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg`
  },
  {
    id: "669404a5-7af4-48c2-9e1c-f06bdc1c3e59",
    title: 'Night by the Pacific Coast',
    category: 'Nature',
    description: 'A mix of smooth noise',
    imageUrl: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg`
  },
  {
    id: "669404a5-7af4-48c2-9e1c-f06bdc1c3e59",
    title: 'Camping thunderstorm',
    category: 'Nature',
    description: 'A mix of smooth noise',
    imageUrl: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg`
  }
];

export default function HomeScreen() {
  const { data } = useLiveQuery(db.select().from(mixesTable));
  const mixes = data || [];

  const router = useRouter();

  const playMix = useCallback((mixId: string) => {
    const mixToPlay = mixes.find((mix) => mix.id === mixId);
    if (mixToPlay) {
      setMixAsNowPlaying(mixToPlay);
      router.push('/now-playing-modal');
    }
  }, [mixes, router]);


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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[
            uiStyles.mainContentPadding,
            styles.tilesContainer,
          ]}>
            {suggestedMixes.map((mix) => (
              <BigTile key={`${mix.id}-${mix.title}`} id={mix.id.toString()} title={mix.title} imageUrl={mix.imageUrl} style={{
                marginRight: spacing.sm
              }} onPress={() => {
                playMix(mix.id);
              }} />
            ))}
          </ScrollView>
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
