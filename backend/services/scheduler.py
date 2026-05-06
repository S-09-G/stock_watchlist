import logging
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler

from config import settings
from database.db import SessionLocal
from database.models import WatchlistItem
from services.stock_service import get_stock_detail

logger = logging.getLogger(__name__)

_scheduler: BackgroundScheduler | None = None


def refresh_all_prices() -> None:
    """Fetch fresh prices for every stock in every user's watchlist and update the DB."""
    logger.info("Scheduler: starting refresh run")
    db = SessionLocal()
    try:
        items = db.query(WatchlistItem).all()
        if not items:
            logger.info("Scheduler: no watchlist items to refresh")
            return

        updated = 0
        failed = 0
        for item in items:
            try:
                fresh = get_stock_detail(item.ticker)
                if fresh is None or fresh.current_price is None:
                    failed += 1
                    continue
                item.current_price = fresh.current_price
                updated += 1
            except Exception as exc:
                # Don't let one bad ticker kill the whole job
                logger.warning("Scheduler: failed to refresh %s — %s", item.ticker, exc)
                failed += 1

        db.commit()
        logger.info(
            "Scheduler: refreshed %d / %d tickers (%d failed)",
            updated,
            len(items),
            failed,
        )
    finally:
        db.close()


def start_scheduler() -> None:
    """Start the background price-refresh job. Idempotent."""
    global _scheduler
    if _scheduler is not None:
        return

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(
        refresh_all_prices,
        trigger="interval",
        minutes=settings.refresh_interval_minutes,
        id="refresh_all_prices",
        max_instances=1,                               # never overlap two runs
        coalesce=True,                                 # collapse missed runs into one
        next_run_time=datetime.now(timezone.utc),     # fire once immediately, then every N min
    )
    _scheduler.start()

    job = _scheduler.get_job("refresh_all_prices")
    logger.info(
        "Scheduler started — refreshing every %d min, next run at %s UTC",
        settings.refresh_interval_minutes,
        job.next_run_time.strftime("%H:%M:%S"),
    )


def shutdown_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        logger.info("Scheduler stopped")
