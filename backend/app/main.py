import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.websockets.connection_manager import manager
from app.services.f1_client import f1_service

background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    task_redis = asyncio.create_task(manager.listen_to_redis())
    task_f1 = asyncio.create_task(f1_service.start_stream())
    
    background_tasks.add(task_redis)
    background_tasks.add(task_f1)
    
    yield 
    
    for task in background_tasks:
        task.cancel() 
        
    if hasattr(manager, 'pubsub'):
        await manager.pubsub.close()
    if hasattr(manager, 'redis_client'):
        await manager.redis_client.aclose()

app = FastAPI(title="F1 Live Telemetry API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "Backend operando em Clean Architecture com Redis"}

@app.get("/api/track")
async def get_track_shape():
    return {"points": f1_service.track_points_str}

@app.websocket("/ws/race")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)