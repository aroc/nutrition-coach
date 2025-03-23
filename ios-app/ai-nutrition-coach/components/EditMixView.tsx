import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, uiStyles } from '@/constants/Styles';
import Input from '@/components/Input';
import { addAudioFileToMix, removeAudioFileFromMix, updateMix } from '@/lib/entity-actions';
import { useRouter } from 'expo-router';
import { CloseViewButton } from '@/components/ui/CloseViewButton';
import AudioFilesList from '@/components/AudioFilesList';
import { AudioFile, Mix, AudioFileMixEntry } from '../types/index';
import { playMix, stopPlayingMix } from '../lib/audio-manager-utils';
import Button from '@/components/Button';
import { useAppStore } from '@/state/store';
import { NowPlayingBar } from '@/components/NowPlayingBar';

const getDefaultMixName = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  return `${dayName}'s new mix`;
};

type EditMixModalProps = {
  mix: Mix;
  onCloseModal: () => void;
};

export default function EditMixView({ mix, onCloseModal }: EditMixModalProps) {
  const router = useRouter();

  const [mixName, setMixName] = useState<string>(mix.name ?? "");

  const handleAudioFilePress = useCallback(async (audioFile: AudioFile) => {
    const existingIndex = mix.audioFiles.findIndex((file: AudioFileMixEntry) => file.id === audioFile.id);

    const isPlaying = useAppStore.getState().isPlaying;

    if (existingIndex === -1) {
      const updatedMix = await addAudioFileToMix(mix.id, audioFile);

      if (!isPlaying) {
        await playMix(updatedMix, { forcePlay: true });
      }
    } else {
      const audioFilesLength = mix.audioFiles.length;
      await removeAudioFileFromMix(mix.id, audioFile.id);

      if (audioFilesLength === 1) {
        await stopPlayingMix();
      }
    }
  }, [
    mix,
  ]);

  const handleSaveMix = useCallback(async () => {
    await updateMix(mix.id, { name: mixName, isTemporary: false });
    router.back();
  }, [router, mix, mixName]);

  const handleUpdateMixName = useCallback((text: string) => {
    setMixName(text);
    updateMix(mix.id, { name: text });
  }, [mix]);

  const mixHasAudioFiles = (mix?.audioFiles || []).length > 0;

  return (
    <SafeAreaView style={[
      styles.safeView,
    ]}>
      <ScrollView style={[
        styles.modalContent,
      ]}>
        <CloseViewButton onPress={onCloseModal} />
        <ThemedText type="title" style={styles.modalTitle}>
          Create Mix
        </ThemedText>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.formDescription}>
              Mix name
            </ThemedText>
            <Input
              placeholder="Mix Name"
              value={mixName}
              onChangeText={handleUpdateMixName}
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.formDescription}>
              Add some sounds
            </ThemedText>
            <ThemedText style={styles.formSubDescription}>
              Choose as many as you want. Optionally set volume for each sound individually.
            </ThemedText>
          </View>

          <AudioFilesList
            onAudioFilePress={handleAudioFilePress}
            activeIds={mix?.audioFiles.map((file: AudioFileMixEntry) => file.id) ?? []}
          />
        </View>
      </ScrollView>

      {mix?.isTemporary && mixHasAudioFiles && (
        <View style={styles.saveButtonContainer}>
          <Button onPress={handleSaveMix}>
            Save Mix
          </Button>
        </View>
      )}

      <NowPlayingBar
        visible={mixHasAudioFiles}
        isNestedInModal={true}
        onPlayPausePress={() => {
          // TODO: Implement play/pause logic
        }}
        onBarPress={() => {
          router.push('/now-playing-modal');
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalTitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    gap: spacing.lg,
    paddingBottom: 140,
  },
  formGroup: {
    ...uiStyles.vstack,
    gap: spacing.sm,
  },
  formDescription: {
    color: colorPalette.zinc[300],
    fontWeight: 500,
  },
  formSubDescription: {
    color: colorPalette.zinc[500],
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 120,
    right: 12,
  },
}); 