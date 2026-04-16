from celery import Celery
from app.config import settings

celery_app = Celery("devpulse", broker=settings.redis_url, backend=settings.redis_url)

@celery_app.task
def process_event_async(event_id: int):
    # e.g., compute streak, trigger webhook, send notification
    print(f"Processing event {event_id}")