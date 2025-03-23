import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import PlusIcon from '../icons/pika/stroke/plus-default';
import { colorPalette } from '../../constants/Colors';

interface FloatingButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  iconOnly?: boolean;
}

export function FloatingButton({ onPress, style, iconOnly, children }: FloatingButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        style,
        iconOnly && styles.iconOnly,
      ]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: colorPalette.emerald[800],
    shadowColor: colorPalette.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconOnly: {
    height: 48,
    width: 48,
  }
});
