import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colorPalette } from '@/constants/Colors';

interface CardContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  paddingSize?: 'small' | 'large';
  contentAlign?: 'flex-start' | 'center' | 'flex-end';
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  style = {},
  paddingSize = 'large',
  contentAlign = 'center',
}) => {
  const containerStyle = [
    styles.container,
    {
      padding: paddingSize === 'small' ? 16 : 24,
      alignItems: contentAlign,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: 12,
    backgroundColor: colorPalette.zinc[50],
  },
});

export default CardContainer;
