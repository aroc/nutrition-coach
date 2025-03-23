import React from 'react';
import { TextInput, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorPalette } from '../constants/Colors';
import { spacing, text } from '../constants/Styles';

export type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  placeholder?: string;
  type?: 'default' | 'email-address' | 'password' | 'numeric';
  required?: boolean;
  variant?: 'default' | 'large';
  showClear?: boolean;
  icon?: string; //
};

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  type = 'default',
  required = false,
  variant = 'default',
  showClear = false,
  icon
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  const handleChange = (text: string) => {
    if (type === 'numeric') {
      // Remove any non-numeric characters
      text = text.replace(/[^0-9]/g, '');
    }
    onChangeText(text);
  };

  const variantStyles = variant === 'large' ? styles.inputLarge : styles.inputDefault;

  return (
    <View style={[
      styles.container,
      showClear && value ? styles.inputWithClear : null,
    ]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={20}
          color={colorPalette.gray[400]}
          style={styles.icon}
        />
      )}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colorPalette.gray[400]}
        value={value}
        onChangeText={handleChange}
        multiline={false} // Prevents new lines
        numberOfLines={1} // Ensures it's a single line
        textAlignVertical="center"
        textAlign="left"
        style={[
          styles.input,
          variantStyles,
          icon ? styles.inputWithIcon : null,
        ]}
        keyboardType={type === 'email-address' ? 'email-address' : type === 'numeric' ? 'number-pad' : 'default'}
        secureTextEntry={type === 'password'}
        autoCapitalize={type === 'email-address' ? 'none' : 'sentences'}
        returnKeyType="done"
      />

      {showClear && value && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
        >
          <Ionicons
            name="close"
            size={16}
            color={colorPalette.gray[400]}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorPalette.zinc[200],
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    position: 'relative',
  },
  input: {
    flex: 1,
    color: colorPalette.gray[700],
    padding: 0,
    height: '100%',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
  },
  inputDefault: {
    fontSize: text.base.fontSize,
    lineHeight: 20,
  },
  inputLarge: {
    ...text['2xl'],
    textAlign: 'center',
    color: colorPalette.gray[400],
  },
  inputWithIcon: {
    marginLeft: 28,
  },
  inputWithClear: {
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    left: 14,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.md,
    backgroundColor: colorPalette.zinc[100],
    borderRadius: 999,
    padding: spacing.xs,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;
