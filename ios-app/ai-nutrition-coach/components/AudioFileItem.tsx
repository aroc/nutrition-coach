import { useCallback, useEffect, useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { Animated, TouchableOpacity, StyleSheet, View, Alert, StyleProp, ViewStyle, ActionSheetIOS } from 'react-native';
import { AudioFile } from '@/types/index';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import PikaVolumeTwo from './icons/pika/solid/volume-two';
import PikaThreeDotsHorizontal from '@/components/icons/pika/stroke/three-dots-horizontal';
import { BlurView } from 'expo-blur';

type AudioFileItemProps = {
  audioFile: AudioFile;
  isActive?: boolean;
  onPress?: (audioFile: AudioFile) => void;
  showVolume?: boolean;
  onVolumeChange?: (audioFile: AudioFile, volume: number) => void;
  onRemove?: (audioFile: AudioFile) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const AudioFileItem: React.FC<AudioFileItemProps> = ({ audioFile, onPress, isActive, showVolume = false, onVolumeChange, onRemove, containerStyle }) => {
  // Create an Animated.Value for rotation
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  }, [isActive]);

  const handlePress = useCallback(() => {
    onPress?.(audioFile);
  }, [audioFile, onPress]);

  const handleRemoveAudioFile = useCallback(() => {
    onRemove?.(audioFile);
  }, [audioFile, onRemove]);

  // Interpolate rotation value
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-2deg']
  });

  const handleVolumeChange = useCallback((value: number[]) => {
    onVolumeChange?.(audioFile, value[0]);
  }, [audioFile, onVolumeChange]);

  const showMoreMenu = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Remove sound from mix', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          handleRemoveAudioFile();
        }
      }
    );
  }, [handleRemoveAudioFile]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={[
        styles.container,
        isActive && styles.active,
        { transform: [{ rotate }] },
        containerStyle,
      ]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <View style={styles.topContainer}>
          <ThemedText style={styles.title}>{audioFile.userPrompt}</ThemedText>

          {onRemove && (
            <TouchableOpacity style={styles.moreMenuButton} onPress={showMoreMenu}>
              <PikaThreeDotsHorizontal color={colorPalette.stone[300]} width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>

        {showVolume && (
          <View style={styles.volumeContainer}>
            <PikaVolumeTwo color={colorPalette.zinc[400]} width={16} height={16} />
            <View style={styles.sliderContainer}>
              <Slider
                thumbStyle={styles.thumbStyle}
                minimumTrackStyle={styles.minimumSliderTrack}
                maximumTrackStyle={styles.maximumSliderTrack}
                value={audioFile.volume}
                onValueChange={handleVolumeChange}
              />
            </View>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: `${colorPalette.zinc[900]}F2`,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: colorPalette.zinc[200],
  },
  active: {
    backgroundColor: colorPalette.emerald[800],
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    paddingRight: 4,
    paddingTop: 8,
    marginBottom: -6,
  },
  sliderContainer: {
    flex: 1,
    width: '100%',
  },
  thumbStyle: {
    backgroundColor: colorPalette.emerald[700],
    borderColor: colorPalette.emerald[600],
    borderWidth: 1,
  },
  minimumSliderTrack: {
    backgroundColor: colorPalette.emerald[900],
  },
  maximumSliderTrack: {
    backgroundColor: colorPalette.black,
  },
  moreMenuButton: {
    backgroundColor: colorPalette.stone[800],
    padding: 4,
    borderRadius: 6,
  }
});

export default AudioFileItem;