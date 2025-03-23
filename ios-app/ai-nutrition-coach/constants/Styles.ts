import { StyleSheet } from "react-native";

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const text = {
  xs: {
    fontSize: 12, // 0.75rem
    lineHeight: 16, // 16/12 = ~1.333
  },
  sm: {
    fontSize: 14, // 0.875rem
    lineHeight: 20, // 20/14 = ~1.429
  },
  base: {
    fontSize: 16, // 1rem
    lineHeight: 24, // 24/16 = 1.5
  },
  lg: {
    fontSize: 18, // 1.125rem
    lineHeight: 28, // 28/18 = ~1.555
  },
  xl: {
    fontSize: 20, // 1.25rem
    lineHeight: 28, // 28/20 = 1.4
  },
  "2xl": {
    fontSize: 24, // 1.5rem
    lineHeight: 32, // 32/24 = 1.333
  },
  "3xl": {
    fontSize: 30, // 1.875rem
    lineHeight: 36, // 36/30 = 1.2
  },
  "4xl": {
    fontSize: 36, // 2.25rem
    lineHeight: 40, // 40/36 = 1.111
  },
  "5xl": {
    fontSize: 48, // 3rem
    lineHeight: 48, // 48/48 = 1
  },
};

const uiStyles = StyleSheet.create({
  modalTopPadding: {
    paddingTop: spacing.lg * 3,
  },
  vstack: {
    display: "flex",
    flexDirection: "column",
  },
  hstack: {
    display: "flex",
    flexDirection: "row",
  },
  mainContentPadding: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  // Add more styles as needed
});

export { spacing, text, uiStyles };
