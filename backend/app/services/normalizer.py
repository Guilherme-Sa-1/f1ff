from app.schemas.telemetry import DriverState

class F1Normalizer:
    @staticmethod
    def parse_driver_state(raw_data:dict)->DriverState:

        return DriverState(
            id=raw_data.get("id",""),
            driverNumber=raw_data.get("driverNumber", 0),
            name=raw_data.get("name", ""),
            team=raw_data.get("team", ""),
            position=raw_data.get("position", 0),
            lap=raw_data.get("lap", 0),
            trackPercentage=raw_data.get("trackPercentage", 0.0),
            gapToLeader=raw_data.get("gapToLeader", ""),
            lastLapTime=raw_data.get("lastLapTime", ""),
            bestLapTime=raw_data.get("bestLapTime", ""),
            sector1=raw_data.get("sector1", ""),
            sector2=raw_data.get("sector2", ""),
            sector3=raw_data.get("sector3", ""),
            tyreCompound=raw_data.get("tyreCompound", ""),
            tyreAge=raw_data.get("tyreAge", 0),
            pitStops=raw_data.get("pitStops", 0),
            inPit=raw_data.get("inPit", False),
            x=raw_data.get("x", 0.0),
            y=raw_data.get("y", 0.0)
        )