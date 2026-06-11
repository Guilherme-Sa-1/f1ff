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
        print("⏳ Baixando telemetria real do GP do Brasil...")
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
            
            # Posiciona os carros na linha de largada em fila indiana
            for i, (_, row) in enumerate(top_drivers.iterrows()):
                active_drivers.append({
                    "id": row['Abbreviation'],
                    "driverNumber": int(row['DriverNumber']),
                    "name": row['FullName'],
                    "team": row['TeamName'],
                    "trackPercentage": 0 - (i * 1.5), # Espaçamento na largada
                    "lap": 1
                })

            print("✅ Pista carregada! Iniciando simulação contínua com ultrapassagens...")
            self.is_connected = True

            while True:
                normalized_data = []

                for drv in active_drivers:
                    # Velocidade base + Fator Aleatório (Simula acelerações e ultrapassagens)
                    speed_boost = random.uniform(1.5, 3.0) 
                    drv["trackPercentage"] += speed_boost

                    # Se passou de 100%, cruzou a linha de chegada (nova volta)
                    if drv["trackPercentage"] >= 100:
                        drv["trackPercentage"] = drv["trackPercentage"] % 100
                        drv["lap"] += 1

                    # Impede que a porcentagem negativa da largada quebre o mapa
                    safe_pct = drv["trackPercentage"] if drv["trackPercentage"] >= 0 else 0
                    
                    # Pega a coordenada exata X e Y na pista
                    wp_index = int((safe_pct / 100.0) * (len(self.waypoints) - 1))
                    car_x = self.waypoints[wp_index]['x']
                    car_y = self.waypoints[wp_index]['y']

                    clean_data = F1Normalizer.parse_driver_state({
                        **drv,
                        "position": 0,
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

                # Ordena primeiro quem tem mais voltas, e depois quem está mais à frente na pista
                normalized_data.sort(key=lambda x: (x["lap"], x["trackPercentage"]), reverse=True)
                
                leader = normalized_data[0]

                for idx, item in enumerate(normalized_data):
                    item["position"] = idx + 1
                    if idx == 0:
                        item["gapToLeader"] = "LÍDER"
                    else:
                        # Calcula a distância correta considerando voltas e porcentagem
                        lap_diff = leader["lap"] - item["lap"]
                        pct_diff = leader["trackPercentage"] - item["trackPercentage"]
                        total_diff = (lap_diff * 100) + pct_diff
                        item["gapToLeader"] = f"+{(total_diff * 0.75):.3f}s"

                # Log dinâmico: Veja as coordenadas mudando sem parar agora!
                print(f"📡 [Ao Vivo] P1: {leader['id']} (Volta {leader['lap']}) | X: {leader['x']} | Y: {leader['y']}")

                await redis_repo.save_telemetry(normalized_data)
                
                # Atualiza 4 vezes por segundo
                await asyncio.sleep(0.25)

        except Exception as e:
            print(f"❌ Erro fatal na simulação: {e}")

f1_service = F1LiveClient()