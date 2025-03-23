import React from "react";
import { ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import PlayIcon from "../icons/custom/play";
import PauseIcon from "../icons/custom/pause";
import { colorPalette } from "@/constants/Colors";

interface RoundPlayPauseButtonProps {
  isPlaying: boolean;
  onPress?: () => void | Promise<void>;
  size?: "small" | "medium" | "large";
  isLoading?: boolean
  color?: "dark" | "light";
  transparent?: boolean;
}

const SIZE_MAP = {
  small: 34,
  medium: 54,
  large: 74
}

const ICON_SIZE_MAP = {
  small: 20,
  medium: 28,
  large: 42
}

const LIGHT_COLOR = colorPalette.zinc[200];
const DARK_COLOR = colorPalette.zinc[900];

const RoundPlayPauseButton: React.FC<RoundPlayPauseButtonProps> = ({
  isPlaying,
  onPress,
  size = "small",
  color = "dark",
  transparent = false,
  isLoading = false
}) => {
  const PlayPauseIcon = isPlaying ? PauseIcon : PlayIcon;

  const containerStyle = {
    width: SIZE_MAP[size],
    height: SIZE_MAP[size],
    backgroundColor: transparent ? "transparent" : color === "dark" ? colorPalette.stone[500] : color === "light" ? colorPalette.zinc[300] : "transparent",
    borderRadius: SIZE_MAP[size] / 2,
  };

  let iconSize = ICON_SIZE_MAP[size];
  if (transparent) {
    iconSize = iconSize + 4;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, containerStyle]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={color === "dark" ? DARK_COLOR : LIGHT_COLOR}
        />
      ) : (
        <PlayPauseIcon
          color={color === "dark" ? LIGHT_COLOR : DARK_COLOR}
          width={iconSize}
          height={iconSize}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoundPlayPauseButton;