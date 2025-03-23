import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { spacing, text } from '../constants/Styles';
import { colorPalette } from '../constants/Colors';

interface ButtonProps {
  onPress?: () => void;
  variant?: 'primary' | 'white' | 'dark' | 'secondary' | 'tertiary';
  children?: React.ReactNode;
  size?: 'extra-small' | 'small' | 'default' | 'large' | 'custom';
  isLoading?: boolean;
  isLoadingText?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = 'primary',
  children,
  size = 'default',
  isLoading = false,
  isLoadingText,
  disabled = false,
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return '#064E3B'; // emerald-900
      case 'white':
        return '#E4E4E7'; // zinc-200
      case 'dark':
        return '#27272A'; // zinc-800
      case 'secondary':
        return '#27272A'; // zinc-800
      case 'tertiary':
        return 'transparent';
      default:
        return '#064E3B'; // emerald-900
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'white':
        return '#18181B'; // zinc-900
      case 'tertiary':
      case 'dark':
        return '#E4E4E7'; // zinc-200
      default:
        return '#F4F4F5'; // zinc-100
    }
  };

  const getFontSize = () => {
    if (size === 'custom') {
      return text.base;
    }

    switch (size) {
      case 'small':
        return text.sm;
      case 'large':
        return text.lg;
      default:
        return text.base;
    }
  };

  const getPaddingHorizontal = () => {
    if (size === 'custom') {
      return undefined;
    }

    switch (size) {
      case 'small':
        return spacing.md;
      case 'large':
        return spacing.xl;
      default:
        return spacing.xl;
    }
  };

  const buttonStyles = [
    styles.button,
    size !== 'custom' && styles.baseSizing,
    size === 'extra-small' && styles.buttonExtraSmall,
    size === 'small' && styles.buttonSmall,
    size === 'large' && styles.buttonLarge,
    {
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: getPaddingHorizontal(),
    },
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={buttonStyles}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={getTextColor()} />
          {isLoadingText && (
            <Text style={[styles.text, { color: getTextColor() }, getFontSize()]}>
              {isLoadingText}
            </Text>
          )}
        </View>
      ) : (
        <Text style={[
          styles.text,
          size === 'large' && styles.textLarge,
          size === 'small' && styles.textSmall,
          { color: getTextColor() }
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseSizing: {
    borderRadius: 100,
    height: 44,
    minWidth: 64,
  },
  buttonLarge: {
    height: 52,
  },
  buttonSmall: {
    height: 36,
  },
  buttonExtraSmall: {
    height: 24,
  },
  text: {
    color: colorPalette.white,
    ...text.base,
  },
  textLarge: {
    ...text.lg,
  },
  textSmall: {
    ...text.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default Button;
