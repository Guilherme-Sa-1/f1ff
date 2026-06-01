# Arquivo: backend/app/main.py
import asyncio
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.websockets.connection_manager import manager

app = FastAPI(title="F1 Live Telemetry API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DRIVERS = [
    {"id": "VER", "number": 1, "name": "Max Verstappen", "team": "Red Bull Racing"},
    {"id": "HAM", "number": 44, "name": "Lewis Hamilton", "team": "Ferrari"},
    {"id": "NOR", "number": 4, "name": "Lando Norris", "team": "McLaren"},
    {"id": "LEC", "number": 16, "name": "Charles Leclerc", "team": "Ferrari"}
]

async def simulate_f1_telemetry():
    lap = 1
    while True:
        telemetry_data = []
        for index, drv in enumerate(DRIVERS):
            track_pct = (asyncio.get_event_loop().time() * 2 + (index * 25)) % 100
            
            state = {
                "id": drv["id"],
                "driverNumber": drv["number"],
                "name": drv["name"],
                "team": drv["team"],
                "position": index + 1,
                "lap": lap,
                "trackPercentage": round(track_pct, 2),
                "gapToLeader": f"+{index * 1.2:.1f}s" if index > 0 else "LÍDER",
                "lastLapTime": "1:18.421",
                "bestLapTime": "1:17.982",
                "sector1": "28.4",
                "sector2": "32.1",
                "sector3": "17.9",
                "tyreCompound": "SOFT",
                "tyreAge": 5,
                "pitStops": 0,
                "inPit": False
            }
            telemetry_data.append(state)
        
        telemetry_data.sort(key=lambda x: x["trackPercentage"], reverse=True)
        for idx, item in enumerate(telemetry_data):
            item["position"] = idx + 1

        await manager.broadcast({"event": "telemetry_update", "data": telemetry_data})
        
        await asyncio.sleep(0.25)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_f1_telemetry())

@app.get("/")
async def root():
    return {"status": "online", "message": "Backend de Telemetria F1 rodando com sucesso!"}

@app.websocket("/ws/race")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)