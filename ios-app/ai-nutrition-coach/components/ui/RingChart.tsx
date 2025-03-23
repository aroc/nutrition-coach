import React from 'react';
import { View, StyleSheet } from 'react-native';

type RingChartProps = {
  size: number;
  strokeWidth: number;
  color: string;
  percentage: number; // 0 to 100
};

const RingChart: React.FC<RingChartProps> = ({
  size,
  strokeWidth,
  color,
  percentage,
}) => {
  const radius = size / 2;
  const circleCircumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const strokeDashoffset =
    circleCircumference - (circleCircumference * percentage) / 100;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.baseCircle,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: '#eee',
          },
        ]}
      />
      <View
        style={[
          styles.overlay,
          {
            width: size,
            height: size,
            borderRadius: radius,
            transform: [{ rotateZ: '-90deg' }],
          },
        ]}
      >
        <View
          style={[
            styles.filledCircle,
            {
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotateZ: `${(360 * percentage) / 100}deg` }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseCircle: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
  },
});

export default RingChart;
