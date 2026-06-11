import json
import redis.asyncio as redis
from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)
        self.pubsub = self.redis_client.pubsub()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        latest_data = await self.redis_client.get("f1:telemetry:latest")
        if latest_data:
            await websocket.send_json({"event": "telemetry_update", "data": json.loads(latest_data)})

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def listen_to_redis(self):
        print("[Redis] Starting listener thread...")
        while True:
            try:
                await self.pubsub.subscribe("f1:telemetry:stream")
                print("[Redis] Subscribed to f1:telemetry:stream successfully.")
                async for message in self.pubsub.listen():
                    if message and message["type"] == "message":
                        data = json.loads(message["data"])
                        payload = {"event": "telemetry_update", "data": data}
                        
                        print(f"[Telemetry] Broadcast via WS to {len(self.active_connections)} clients")
                        
                        for connection in list(self.active_connections):
                            try:
                                await connection.send_json(payload)
                            except Exception:
                                self.disconnect(connection)
            except Exception as e:
                print(f"[Redis] Listener error. Reconnecting in 2s: {e}")
                await asyncio.sleep(2)

manager = ConnectionManager()