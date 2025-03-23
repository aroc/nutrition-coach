import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import CrossCircle from '@/components/icons/pika/solid/cross-circle';
import { colorPalette } from '@/constants/Colors';

interface CloseViewButtonProps {
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function CloseViewButton({ onPress, size = 34, style }: CloseViewButtonProps) {
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
      <CrossCircle width={size} height={size} color={colorPalette.zinc[600]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
