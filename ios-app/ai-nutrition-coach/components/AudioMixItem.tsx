import { useCallback, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Easing, Alert, Animated } from 'react-native';
import { useAppStore } from '../state/store';
import { Mix } from '@/types/index';
import PopoverContextMenu from './ui/PopoverContextMenu';
import { ThemedText } from '@/components/ThemedText';
import { truncateText, pluralize } from '../lib/utils';
import { togglePlayingMix } from '../lib/audio-manager-utils';
import RoundPlayPauseButton from './ui/RoundPlayPauseButton';
import PikaThreeDotsHorizontal from './icons/pika/stroke/three-dots-horizontal';
import { colorPalette } from '@/constants/Colors';
import PikaDelete02 from './icons/pika/stroke/delete-02';
import PikaPencilEdit from './icons/pika/stroke/pencil-edit';
import { deleteMix } from '../lib/entity-actions';
import { useRouter } from 'expo-router';

type AudioMixItemProps = {
  mix: Mix;
  onClick?: (mix: Mix) => void;
};

const AudioMixItem: React.FC<AudioMixItemProps> = ({ mix, onClick }) => {
  const { isPlaying, nowPlayingMix, getAreMixFilesBeingDownloaded, isOffline } = useAppStore();
  const [isHidden, setIsHidden] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const router = useRouter();

  useEffect(() => {
    if (isHidden) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease
      }).start();
    }
  }, [isHidden, fadeAnim]);

  const isDownloadingMixFiles = getAreMixFilesBeingDownloaded(mix) && nowPlayingMix?.id === mix.id;

  const isNowPlayingMix = nowPlayingMix?.id === mix.id;
  const isPlayingMix = isPlaying && isNowPlayingMix;

  const handlePlayPauseClick = useCallback(() => {
    togglePlayingMix(mix);
  }, [mix]);

  const handleDeleteMix = useCallback(() => {
    Alert.alert(
      'Delete Mix',
      `Are you sure you want to delete "${mix.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setIsHidden(true);
            setTimeout(() => {
              deleteMix(mix.id);
            }, 10);
          },
        },
      ]
    );
  }, [mix.name, mix.id]);

  const handleClick = useCallback(() => {
    handlePlayPauseClick();
  }, [mix, handlePlayPauseClick]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.container}
        onPress={handleClick}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <RoundPlayPauseButton
            isPlaying={isPlayingMix}
            onPress={handlePlayPauseClick}
            color="dark"
            isLoading={isDownloadingMixFiles}
          />

          <View style={styles.textContainer}>
            <ThemedText style={styles.mixName} numberOfLines={1}>{truncateText(mix.name, 28)}</ThemedText>
            <ThemedText muted type="small">{mix?.audioFiles?.length} {pluralize('sound', mix?.audioFiles?.length)}</ThemedText>
          </View>

          <View style={styles.moreMenu}>
            <PopoverContextMenu menuItems={[
              {
                label: 'Edit',
                icon: PikaPencilEdit,
                onPress: () => {
                  router.push({
                    pathname: '/edit-mix-modal',
                    params: { mixid: mix.id }
                  })
                }
              },
              {
                label: 'Delete',
                isDestructive: true,
                icon: PikaDelete02,
                onPress: handleDeleteMix,
              }
            ]}>
              <View style={styles.moreMenuButton}>
                <PikaThreeDotsHorizontal color={colorPalette.stone[300]} width={20} height={20} />
              </View>
            </PopoverContextMenu>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    paddingHorizontal: 8,
    borderRadius: 16,
    width: '100%',
    height: 72,
    backgroundColor: '#18181B', // zinc-900
  },
  content: {
    padding: 8,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mixName: {
  },
  moreMenu: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  moreMenuButton: {
    backgroundColor: colorPalette.stone[800],
    padding: 4,
    borderRadius: 6,
  }
});

export default AudioMixItem;