import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, uiStyles } from '@/constants/Styles';
import { useRouter } from 'expo-router';
import { DismissDownViewButton } from '@/components/ui/DismissDownViewButton';
import { useAppStore } from '../state/store';
import { Image } from 'expo-image';
import AudioFileItem from '../components/AudioFileItem';
import { updateMixAudioFile, removeAudioFileFromMix } from '../lib/entity-actions';
import { AudioFile } from '../types';
import RoundPlayPauseButton from '@/components/ui/RoundPlayPauseButton';
import { togglePlayingMix } from '@/lib/audio-manager-utils';
import { LinearGradient } from 'expo-linear-gradient';
export default function NowPlayingModal() {
  const router = useRouter();
  const { nowPlayingMix, isPlaying, getAreMixFilesBeingDownloaded } = useAppStore();

  const handleVolumeChange = useCallback((audioFile: AudioFile, volume: number) => {
    if (!nowPlayingMix?.id) return;

    updateMixAudioFile(nowPlayingMix.id, audioFile.id, { volume });
  }, [nowPlayingMix]);

  const handleRemoveAudioFile = useCallback((audioFile: AudioFile) => {
    if (!nowPlayingMix?.id) return;

    removeAudioFileFromMix(nowPlayingMix.id, audioFile.id);
  }, [nowPlayingMix]);

  const isDownloadingMixFiles = nowPlayingMix ? getAreMixFilesBeingDownloaded(nowPlayingMix) : false;

  const handlePlayPauseClick = useCallback(() => {
    if (!nowPlayingMix?.id) return;

    togglePlayingMix(nowPlayingMix);
  }, [nowPlayingMix]);

  const dismissModal = useCallback(() => {
    console.log('devnote: dismissing modal');
    router.back();
  }, [router]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y < -140) {
      dismissModal();
    }
  }, [dismissModal]);

  if (!nowPlayingMix) return null;

  return (
    <SafeAreaView style={styles.safeViewWrapper}>
      <View style={styles.header}>
        <DismissDownViewButton onPress={dismissModal} style={styles.dismissButton} />
        <ThemedText style={styles.modalTitle}>
          Now Playing
        </ThemedText>
      </View>
      <Image style={styles.artworkImageBg} source={{ uri: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg` }} />
      <LinearGradient
        colors={['rgba(0,0,0, 0.1)', 'rgba(0,0,0, 0.98)']}
        style={styles.gradient}
      />
      <ScrollView
        style={[
          uiStyles.mainContent,
          styles.container,
        ]}
        onScroll={handleScroll}
      >
        <View style={styles.body}>
          <View style={styles.artworkSpacer}></View>
          {/* <View style={styles.nowPlayingArtwork}>
            <Image style={styles.artworkImage} source={{ uri: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg` }} />
          </View> */}

          <View style={styles.mixNameContainer}>
            <RoundPlayPauseButton
              isPlaying={isPlaying}
              onPress={handlePlayPauseClick}
              color="dark"
              isLoading={isDownloadingMixFiles}
              size="medium"
            />

            <ThemedText type='subtitle' style={styles.mixName}>
              {nowPlayingMix?.name}
            </ThemedText>

          </View>

          {nowPlayingMix && (
            <View style={styles.audioFilesContainer}>
              {nowPlayingMix.audioFiles.map((audioFile: AudioFile) => (
                <AudioFileItem
                  key={audioFile.id}
                  audioFile={audioFile}
                  showVolume={true}
                  onVolumeChange={handleVolumeChange}
                  onRemove={handleRemoveAudioFile}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeViewWrapper: {
    flex: 1,
  },
  artworkImageBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    zIndex: 2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xl,
    position: 'absolute',
    zIndex: 10,
    top: 60,
    left: 12,
    right: 12,
  },
  modalTitle: {
    fontSize: 14,
    color: colorPalette.zinc[200],
    letterSpacing: 3.0,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dismissButton: {
    position: 'absolute',
    left: 0,
    top: 4,
    zIndex: 11,
  },
  mixName: {
    textAlign: 'center',
  },
  mixNameContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: spacing.md,
  },
  artworkSpacer: {
    width: '100%',
    height: 300,
  },
  nowPlayingArtwork: {
    width: '90%',
    alignSelf: 'center',
    height: 300,
    marginBottom: spacing.md,
    backgroundColor: colorPalette.zinc[900],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorPalette.zinc[800],
    overflow: 'hidden',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  audioFilesContainer: {
    gap: spacing.md,
    width: '100%',
    paddingTop: spacing.md,
  },
  audioFileItem: {
  },
}); 