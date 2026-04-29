from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routers import auth, events, stats
from app.routers.events import limiter

app = FastAPI(title="DevPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://pushandpray.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(stats.router)