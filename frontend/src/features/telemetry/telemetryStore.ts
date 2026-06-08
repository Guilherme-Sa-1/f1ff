import { create } from 'zustand';
import { DriverState } from '../../types/telemetry';

interface TelemetryStore {
  drivers: DriverState[];
  isConnected: boolean;
  setDrivers: (drivers: DriverState[]) => void;
  setConnected: (status: boolean) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  drivers: [],
  isConnected: false,
  setDrivers: (drivers) => set({ drivers }),
  setConnected: (status) => set({ isConnected: status }),
}));