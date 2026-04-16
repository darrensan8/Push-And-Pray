from sqlalchemy import Column, Integer, String, DateTime, JSON, func, ForeignKey
from app.database import Base

class GitHubEvent(Base):
    __tablename__ = "github_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)
    repository = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())