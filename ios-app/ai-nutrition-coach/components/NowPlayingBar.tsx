import React, { useCallback, useEffect } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './ThemedText';
import RoundPlayPauseButton from './ui/RoundPlayPauseButton';
import { useAppStore } from '../state/store';
import { Mix } from '@/types/index';
import { togglePlayingMix } from '@/lib/audio-manager-utils';
import { pluralize } from '@/lib/utils';
import { colorPalette } from '@/constants/Colors';

interface NowPlayingBarProps {
  onPlayPausePress: () => void;
  onBarPress: () => void;
  isNestedInModal?: boolean;
  visible?: boolean;
}

export function NowPlayingBar({
  onBarPress,
  isNestedInModal = false,
  visible = true,
}: NowPlayingBarProps) {
  const { isPlaying, nowPlayingMix: nowPlayingMixState, getAreMixFilesBeingDownloaded } = useAppStore();

  const nowPlayingMix: Mix | null = nowPlayingMixState;

  const fadeAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  // const areMixFilesBeingDownloaded = getAreMixFilesBeingDownloaded(nowPlayingMixId);

  const handlePlayPauseClick = useCallback(() => {
    togglePlayingMix(nowPlayingMix as Mix);
  }, [nowPlayingMix]);

  const numAudioFilesPlayingText = nowPlayingMix && nowPlayingMix.audioFiles.length > 0 ? `${nowPlayingMix.audioFiles.length} ${pluralize('sound', nowPlayingMix.audioFiles.length, 'sounds')}` : " ";

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Pressable style={[
        styles.container,
        {
          bottom: isNestedInModal ? 20 : 84,
        }
      ]} onPress={onBarPress}>
        <View style={styles.content}>
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_S3_BASE_URL}images/northern_pacific_coast.jpg` }}
              style={styles.artwork}
            />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {nowPlayingMix?.name}
            </ThemedText>
            <ThemedText style={styles.subtitle} numberOfLines={1}>
              {numAudioFilesPlayingText}
            </ThemedText>
          </View>
          <View style={styles.controls}>
            <RoundPlayPauseButton
              isPlaying={isPlaying}
              onPress={handlePlayPauseClick}
              size="small"
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    backgroundColor: '#282828',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  artworkContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colorPalette.zinc[900],
    overflow: 'hidden',
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    margin: 0,
    padding: 0,
  },
  subtitle: {
    color: colorPalette.zinc[400],
    fontSize: 14,
    fontWeight: '400',
    marginTop: -4,
    padding: 0,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
