export interface DriverState {
  id: string;
  driverNumber: number;
  name: string;
  team: string;
  position: number;
  lap: number;
  trackPercentage: number;
  gapToLeader: string;
  lastLapTime: string;
  bestLapTime: string;
  sector1: string;
  sector2: string;
  sector3: string;
  tyreCompound: string;
  tyreAge: number;
  pitStops: number;
  inPit: boolean;
}

export interface TelemetryUpdate {
  event: string;
  data: DriverState[];
}