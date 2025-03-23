import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colorPalette } from '@/constants/Colors';
import PikaChevronDown from '@/components/icons/pika/stroke/chevron-down-big';

interface DismissDownViewButtonProps {
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function DismissDownViewButton({ onPress, size = 34, style }: DismissDownViewButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      onPress={onPress}
    >
      <PikaChevronDown color={colorPalette.zinc[300]} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.zinc[800],
  },
  icon: {
    marginTop: 2,
  }
});
