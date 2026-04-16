from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.services.stats_service import get_stats

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/")
async def stats(user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_stats(user_id, db)