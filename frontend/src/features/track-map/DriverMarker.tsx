import React, { useEffect } from 'react';
import { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { DriverState } from '../../types/telemetry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  driver: DriverState;
  teamColor: string;
}

export const DriverMarker = React.memo(({ driver, teamColor }: Props) => {
  // Previne que x=0 seja considerado falso
  const posX = useSharedValue(driver.x != null ? driver.x : 0);
  const posY = useSharedValue(driver.y != null ? driver.y : 0);

  useEffect(() => {
    if (driver.x != null && driver.y != null) {
      posX.value = withTiming(driver.x, { duration: 250, easing: Easing.linear });
      posY.value = withTiming(driver.y, { duration: 250, easing: Easing.linear });
    }
  }, [driver.x, driver.y]);

  const animatedProps = useAnimatedProps(() => {
    return { cx: posX.value, cy: posY.value };
  });

  // Condicional estrita (0 agora passa na validação)
  if (driver.x == null || driver.y == null) return null;

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r="6"
      fill={teamColor}
      stroke="#FFF"
      strokeWidth="1.5"
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.driver.x === nextProps.driver.x && prevProps.driver.y === nextProps.driver.y;
});