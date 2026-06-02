import json
import redis.asyncio as redis

class RedisRepository:
    def __init__(self):
        # Conecta ao Redis que acabamos de subir no Docker
        self.redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

    async def save_telemetry(self, data: list):
        payload = json.dumps(data)
        
        # 1. CACHE: Salva a última posição (útil para quem acabou de abrir o app)
        await self.redis_client.set("f1:telemetry:latest", payload)
        
        # 2. PUB/SUB: Grita no megafone para todos os servidores WebSocket distribuírem
        await self.redis_client.publish("f1:telemetry:stream", payload)

redis_repo = RedisRepository()