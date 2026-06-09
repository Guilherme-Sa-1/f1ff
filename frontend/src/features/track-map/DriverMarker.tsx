import React from 'react';
import { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { DriverState } from '../../types/telemetry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  driver: DriverState;
  teamColor: string;
}

export function DriverMarker({ driver, teamColor }: Props) {
  const animatedProps = useAnimatedProps(() => {
    return {
      cx: withTiming(driver.x || 0, { duration: 250, easing: Easing.linear }),
      cy: withTiming(driver.y || 0, { duration: 250, easing: Easing.linear }),
    };
  }, [driver.x, driver.y]);

  if (!driver.x || !driver.y) return null;

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