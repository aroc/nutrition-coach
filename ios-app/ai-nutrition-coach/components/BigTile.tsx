import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ThemedText } from './ThemedText';
import { spacing } from '../constants/Styles';
import { colorPalette } from '../constants/Colors';

interface BigTileProps {
  id: string;
  title: string;
  imageUrl: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function BigTile({ id, title, imageUrl, style, onPress }: BigTileProps) {
  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.8}
      style={[
        styles.bigMixTile,
        style
      ]}
      onPress={onPress}>
      <Image style={styles.bigMixTileBg} source={{ uri: imageUrl }} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
        style={styles.gradient}
      />
      <View style={styles.tileContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bigMixTile: {
    position: 'relative',
    width: 180,
    height: 280,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colorPalette.zinc[800],
    overflow: 'hidden',
  },
  bigMixTileBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  tileContent: {
    position: 'absolute',
    padding: spacing.sm,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    zIndex: 3,
  }
});
