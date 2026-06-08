import React, { useEffect } from 'react';
import { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { DriverState } from '../../types/telemetry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  driver: DriverState;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  teamColor: string;
}

export function DriverMarker({ driver, centerX, centerY, radiusX, radiusY, teamColor }: Props) {
  const progress = useSharedValue(driver.trackPercentage);

  useEffect(() => {
    if (Math.abs(progress.value - driver.trackPercentage) > 50) {
      progress.value = driver.trackPercentage;
    } else {
      progress.value = withTiming(driver.trackPercentage, { 
        duration: 250, 
        easing: Easing.linear 
      });
    }
  }, [driver.trackPercentage]);

  const animatedProps = useAnimatedProps(() => {
    const angle = (progress.value / 100) * 2 * Math.PI - (Math.PI / 2);
    return {
      cx: centerX + radiusX * Math.cos(angle),
      cy: centerY + radiusY * Math.sin(angle),
    };
  });

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r="6"
      fill={teamColor}
      stroke="#FFF"
      strokeWidth="1.5"
    />
  );
}