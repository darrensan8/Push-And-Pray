from pydantic import BaseModel
from datetime import datetime
from typing import Any

class EventCreate(BaseModel):
    event_type: str
    repository: str
    payload: dict[str, Any]

class EventOut(BaseModel):
    id: int
    event_type: str
    repository: str
    payload: dict[str, Any]
    recieved_at: datetime

    model_config = {
        "from_attributes": True}