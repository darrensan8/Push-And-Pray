import redis.asyncio as redis
import json
from app.config import settings

redis_client = redis.from_url(settings.redis_url)

async def get_stats(user_id: int, db) -> dict:
    cache_key = f"stats:user:{user_id}"
    
    # Try cache first
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Compute from DB
    from sqlalchemy import select, func
    from app.models.event import GitHubEvent
    
    result = await db.execute(
        select(GitHubEvent.event_type, func.count().label("count"))
        .where(GitHubEvent.user_id == user_id)
        .group_by(GitHubEvent.event_type)
    )
    stats = {row.event_type: row.count for row in result}
    
    # Cache for 5 minutes
    await redis_client.setex(cache_key, 300, json.dumps(stats))
    return stats