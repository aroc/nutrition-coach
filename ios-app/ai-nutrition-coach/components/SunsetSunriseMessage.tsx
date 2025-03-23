import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { ThemedText } from './ThemedText';
import { getSunMessage } from '@/lib/utils';
import { fetchSunData } from '@/lib/api-fetch';
import SunIcon from './icons/untitled/sun';
import SunsetIcon from './icons/untitled/sunset-01';
import { useAppStore } from '@/state/store';
import { colorPalette } from '@/constants/Colors';
import { spacing } from '@/constants/Styles';

const SunsetSunriseMessage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { sunData } = useAppStore();

  useEffect(() => {
    const getCoordinates = async () => {
      const getGranted = async () => {
        const location = await Location.getCurrentPositionAsync({});
        fetchSunData(location.coords.latitude, location.coords.longitude);
      }

      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus === 'undetermined') {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'denied') {
          console.warn('Location permission denied');
        } else if (status === 'granted') {
          console.log('Location permission granted');
          getGranted();
        }
      } else if (existingStatus === 'granted') {
        getGranted();
      }
    };

    if (!sunData) {
      getCoordinates();
    }
  }, [sunData]);

  useEffect(() => {
    if (sunData) {
      setIsVisible(true);
    }
  }, [sunData]);

  return isVisible ? (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.messageContainer}>
        {!sunData ? (
          <ThemedText muted>Getting sun times...</ThemedText>
        ) : (
          <View style={styles.row}>
            {getSunMessage(sunData).type === 'sunrise' && <SunIcon size={16} color={colorPalette.slate[400]} />}
            {getSunMessage(sunData).type === 'sunset' && <SunsetIcon size={16} color={colorPalette.slate[400]} />}
            <ThemedText muted style={styles.messageText}>
              {getSunMessage(sunData).label}
            </ThemedText>
          </View>
        )}
      </View>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  messageContainer: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageText: {
    marginLeft: 4,
  },
});

export default SunsetSunriseMessage;