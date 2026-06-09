// Arquivo: frontend/src/features/track-map/DriverMarker.tsx
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
  // O hook useAnimatedProps reage automaticamente às mudanças que chegam do WebSocket
  // e joga a interpolação direto para a placa de vídeo (60 FPS)
  const animatedProps = useAnimatedProps(() => {
    return {
      cx: withTiming(driver.x || 0, { duration: 250, easing: Easing.linear }),
      cy: withTiming(driver.y || 0, { duration: 250, easing: Easing.linear }),
    };
  }, [driver.x, driver.y]);

  // Se a coordenada da pista ainda não chegou do backend, esconde a bolinha
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