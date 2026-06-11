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
  setDrivers: (newDrivers) => {
    console.log("[Store] Drivers updated:", newDrivers.length);
    set({ drivers: [...newDrivers] }); 
  },
  setConnected: (status) => set({ isConnected: status }),
}));