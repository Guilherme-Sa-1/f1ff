// Arquivo: frontend/src/features/track-map/DriverMarker.tsx
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
  // Cria uma variável na placa de vídeo para guardar a posição atual
  const posX = useSharedValue(driver.x || 0);
  const posY = useSharedValue(driver.y || 0);

  // Toda vez que chegar um X ou Y novo do backend, ele desliza até lá suavemente
  useEffect(() => {
    if (driver.x && driver.y) {
      posX.value = withTiming(driver.x, { duration: 250, easing: Easing.linear });
      posY.value = withTiming(driver.y, { duration: 250, easing: Easing.linear });
    }
  }, [driver.x, driver.y]);

  // Aplica a posição no círculo sem recarregar a tela inteira
  const animatedProps = useAnimatedProps(() => {
    return {
      cx: posX.value,
      cy: posY.value,
    };
  });

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
});