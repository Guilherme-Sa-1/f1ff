from pydantic import BaseModel

class DriverState(BaseModel):
    id: str
    driverNumber: int
    name: str
    team: str
    position: int
    lap: int
    trackPercentage: float
    gapToLeader: str
    lastLapTime: str
    bestLapTime: str
    sector1: str
    sector2: str
    sector3: str
    tyreCompound: str
    tyreAge: int
    pitStops: int
    inPit: bool