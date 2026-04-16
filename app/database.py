from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import Settings

engine = create_async_engine(Settings().database_url, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

class Base(declarative_base()):
    pass