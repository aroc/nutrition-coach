import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { uiStyles } from '@/constants/Styles';
import db from '@/db/db';
import { desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { mixes as mixesTable, audioFiles as audioFilesTable } from '@/db/schema';
import AudioMixItem from '@/components/AudioMixItem';
import PillTabs from '@/components/ui/PillTabs';
import Button from '@/components/Button';
import { spacing } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { colorPalette } from '@/constants/Colors';
import PlusIcon from '@/components/icons/pika/stroke/plus-default';
import AudioFilesList from '@/components/AudioFilesList';
import { AudioFileMixEntry, AudioFile } from '@/types/index';

const ROOT_TABS = {
  favorites: {
    id: 'favorites',
    label: 'Favorites',
  },
  mixes: {
    id: 'mixes',
    label: 'Your mixes',
  },
  sounds: {
    id: 'sounds',
    label: 'Sounds',
  },
};

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<"mixes" | "sounds" | "favorites">('mixes');

  const { data: mixesData } = useLiveQuery(db.select().from(mixesTable).where(eq(mixesTable.isTemporary, false)).orderBy(desc(mixesTable.createdAt)));
  const mixes = mixesData || [];

  const { data: audioFilesData } = useLiveQuery(db.select().from(audioFilesTable).orderBy(desc(audioFilesTable.createdAt)));
  const audioFiles = audioFilesData || [];

  const hasMixes = mixes.length > 0;

  const router = useRouter();

  const handleCreateMix = useCallback(() => {
    router.push('/create-mix-modal');
  }, [router]);

  const handleAudioFilePress = useCallback((audioFile: AudioFile) => {
    // todo: play the track...
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[
        uiStyles.mainContent,
        styles.container,
      ]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title">
              Sounds
            </ThemedText>
            <Button onPress={handleCreateMix} variant="tertiary" size="custom" style={{
              width: 26, height: 26, borderRadius: 100,
            }}>
              <PlusIcon width={24} height={24} color={colorPalette.white} />
            </Button>
          </View>

          <PillTabs
            tabs={Object.values(ROOT_TABS)}
            activeTabId={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as "mixes" | "sounds" | "favorites")}
            style={{
              marginBottom: spacing.xl,
            }}
          />

          {activeTab === "mixes" && hasMixes && (
            <View style={styles.mixList}>
              {mixes?.map((mix) => (
                <AudioMixItem key={mix.id} mix={mix} />
              ))}
            </View>
          )}

          {activeTab === "mixes" && !hasMixes && (
            <View style={styles.mixList}>
              <ThemedText type="title">No mixes found</ThemedText>
            </View>
          )}

          {activeTab === "sounds" && (
            <View style={styles.mixList}>
              <AudioFilesList
                onAudioFilePress={handleAudioFilePress}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mixList: {
    gap: 8,
    paddingBottom: 94,
  },
  mixItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 160,
    right: 24,
  },
});
