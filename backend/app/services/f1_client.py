# Arquivo: backend/app/services/f1_client.py
import asyncio
from app.services.normalizer import F1Normalizer
from app.repositories.redis_repository import redis_repo

class F1LiveClient:
    def __init__(self):
        self.is_connected = False

    async def start_stream(self):
        self.is_connected = True
        lap = 1
        
        drivers_mock = [
            {"id": "VER", "driverNumber": 1, "name": "Max Verstappen", "team": "Red Bull Racing", "speed": 3.1, "offset": 0},
            {"id": "HAM", "driverNumber": 44, "name": "Lewis Hamilton", "team": "Ferrari", "speed": 2.9, "offset": 5},
            {"id": "NOR", "driverNumber": 4, "name": "Lando Norris", "team": "McLaren", "speed": 3.2, "offset": 12},
            {"id": "LEC", "driverNumber": 16, "name": "Charles Leclerc", "team": "Ferrari", "speed": 2.8, "offset": 18}
        ]

        while True:
            normalized_data = []
            current_time = asyncio.get_event_loop().time()

            for drv in drivers_mock:
                track_pct = (current_time * drv["speed"] + drv["offset"]) % 100
                
                clean_data = F1Normalizer.parse_driver_state({
                    **drv,
                    "position": 0,
                    "lap": lap,
                    "trackPercentage": round(track_pct, 2),
                    "gapToLeader": "",
                    "lastLapTime": "1:18.421",
                    "bestLapTime": "1:17.982",
                    "sector1": "28.4",
                    "sector2": "32.1",
                    "sector3": "17.9",
                    "tyreCompound": "SOFT",
                    "tyreAge": 5,
                    "pitStops": 0,
                    "inPit": False
                })
                normalized_data.append(clean_data.model_dump())

            normalized_data.sort(key=lambda x: x["trackPercentage"], reverse=True)
            
            for idx, item in enumerate(normalized_data):
                item["position"] = idx + 1
                item["gapToLeader"] = f"+{idx * 1.5:.1f}s" if idx > 0 else "LÍDER"

            await redis_repo.save_telemetry(normalized_data)
            await asyncio.sleep(0.25)

f1_service = F1LiveClient()