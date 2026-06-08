import asyncio
import time
import random
from app.services.normalizer import F1Normalizer
from app.repositories.redis_repository import redis_repo

class F1LiveClient:
    def __init__(self):
        self.is_connected = False

    async def start_stream(self):
        self.is_connected = True
        lap = 1
        
        drivers_mock = [
            {"id": "VER", "driverNumber": 1, "name": "Max Verstappen", "team": "Red Bull Racing", "speed": 9.1, "offset": 0},
            {"id": "HAM", "driverNumber": 44, "name": "Lewis Hamilton", "team": "Ferrari", "speed": 8.9, "offset": 5},
            {"id": "NOR", "driverNumber": 4, "name": "Lando Norris", "team": "McLaren", "speed": 9.3, "offset": 12},
            {"id": "LEC", "driverNumber": 16, "name": "Charles Leclerc", "team": "Ferrari", "speed": 8.7, "offset": 18}
        ]

        while True:
            try:
                normalized_data = []
                current_time = time.time()

                for drv in drivers_mock:
                    track_pct = (current_time * drv["speed"] + drv["offset"]) % 100
                    
                    clean_data = F1Normalizer.parse_driver_state({
                        **drv,
                        "position": 0,
                        "lap": lap,
                        "trackPercentage": round(track_pct, 2),
                        "gapToLeader": "",
                        "lastLapTime": f"1:18.{random.randint(100, 999)}",
                        "bestLapTime": f"1:17.{random.randint(100, 999)}",
                        "sector1": f"28.{random.randint(10, 99)}",
                        "sector2": f"32.{random.randint(10, 99)}",
                        "sector3": f"17.{random.randint(10, 99)}",
                        "tyreCompound": "SOFT",
                        "tyreAge": 5,
                        "pitStops": 0,
                        "inPit": False
                    })
                    normalized_data.append(clean_data.model_dump())

                normalized_data.sort(key=lambda x: x["trackPercentage"], reverse=True)
                
                leader_pct = normalized_data[0]["trackPercentage"]

                for idx, item in enumerate(normalized_data):
                    item["position"] = idx + 1
                    if idx == 0:
                        item["gapToLeader"] = "LÍDER"
                    else:
                        gap_pct = leader_pct - item["trackPercentage"]
                        if gap_pct < 0: gap_pct += 100
                        gap_seconds = gap_pct * 0.8
                        item["gapToLeader"] = f"+{gap_seconds:.3f}s"

                print(f"📡 [250ms] Telemetria atualizada. Líder: {normalized_data[0]['id']}")

                await redis_repo.save_telemetry(normalized_data)
            except Exception as e:
                print(f"⚠️ Erro silencioso no simulador: {e}")

            await asyncio.sleep(0.25)

f1_service = F1LiveClient()