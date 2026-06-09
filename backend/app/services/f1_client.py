# Arquivo: backend/app/services/f1_client.py
import asyncio
import time
import random
import fastf1
import os
from app.services.normalizer import F1Normalizer
from app.repositories.redis_repository import redis_repo

if not os.path.exists("f1_cache"):
    os.makedirs("f1_cache")
fastf1.Cache.enable_cache("f1_cache")

class F1LiveClient:
    def __init__(self):
        self.is_connected = False
        self.waypoints = []
        self.track_points_str = ""

    async def start_stream(self):
        print("⏳ Baixando telemetria real do GP do Brasil (Pode levar uns 20s na 1ª vez)...")
        try:
            session = fastf1.get_session(2023, 'Brazil', 'R')
            session.load(telemetry=True, weather=False)

            fastest_lap = session.laps.pick_fastest()
            tel = fastest_lap.get_telemetry()
            
            x_real = tel['X'].fillna(0).values
            y_real = tel['Y'].fillna(0).values

            min_x, max_x = min(x_real), max(x_real)
            min_y, max_y = min(y_real), max(y_real)

            points_list = []
            for i in range(len(x_real)):
                nx = ((x_real[i] - min_x) / (max_x - min_x)) * 300 + 20
                ny = ((y_real[i] - min_y) / (max_y - min_y)) * 180 + 20
                ny = 220 - ny
                
                self.waypoints.append({"x": nx, "y": ny})
                if i % 4 == 0:
                    points_list.append(f"{nx},{ny}")
            
            self.track_points_str = " ".join(points_list)

            top_drivers = session.results.head(5)
            active_drivers = []
            for i, (_, row) in enumerate(top_drivers.iterrows()):
                active_drivers.append({
                    "id": row['Abbreviation'],
                    "driverNumber": int(row['DriverNumber']),
                    "name": row['FullName'],
                    "team": row['TeamName'],
                    "speed": 8.5 - (i * 0.1),
                    "offset": i * 15
                })

            print("✅ Pista de Interlagos carregada! Iniciando transmissão contínua...")
            self.is_connected = True
            lap = 1

            while True:
                normalized_data = []
                current_time = time.time()

                for drv in active_drivers:
                    track_pct = (current_time * drv["speed"] + drv["offset"]) % 100
                    
                    wp_index = int((track_pct / 100.0) * (len(self.waypoints) - 1))
                    car_x = self.waypoints[wp_index]['x']
                    car_y = self.waypoints[wp_index]['y']

                    clean_data = F1Normalizer.parse_driver_state({
                        **drv,
                        "position": 0,
                        "lap": lap,
                        "trackPercentage": round(track_pct, 2),
                        "x": round(car_x, 2),
                        "y": round(car_y, 2),
                        "gapToLeader": "",
                        "lastLapTime": f"1:11.{random.randint(100, 999)}",
                        "bestLapTime": f"1:10.{random.randint(100, 999)}",
                        "sector1": f"18.{random.randint(10, 99)}",
                        "sector2": f"36.{random.randint(10, 99)}",
                        "sector3": f"16.{random.randint(10, 99)}",
                        "tyreCompound": "SOFT",
                        "tyreAge": random.randint(1, 15),
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
                        item["gapToLeader"] = f"+{(gap_pct * 0.75):.3f}s"

                # AVISO VISUAL NO SEU TERMINAL:
                print(f"📡 [Ao Vivo] Atualizando mapa... Líder em X: {normalized_data[0]['x']}")

                await redis_repo.save_telemetry(normalized_data)
                await asyncio.sleep(0.25)

        except Exception as e:
            print(f"❌ Erro fatal no FastF1: {e}")

f1_service = F1LiveClient()