from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.schemas.event import EventCreate, EventOut
from app.models.event import GitHubEvent

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=EventOut)
@limiter.limit("30/minute")
async def ingest_event(
    request: Request,
    event_in: EventCreate,
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    event = GitHubEvent(user_id=user_id, **event_in.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event

@router.get("/", response_model=list[EventOut])
async def list_events(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    result = await db.execute(
        select(GitHubEvent).where(GitHubEvent.user_id == user_id).order_by(GitHubEvent.received_at.desc())
    )
    return result.scalars().all()