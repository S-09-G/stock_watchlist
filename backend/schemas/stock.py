from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, field_validator


class WatchlistItemResponse(BaseModel):
    id: int
    ticker: str
    company_name: str
    current_price: Decimal | None
    sector: str | None
    currency: str | None
    added_at: datetime
    last_updated: datetime

    model_config = {"from_attributes": True}


class StockDetail(BaseModel):
    ticker: str
    company_name: str
    current_price: float | None
    currency: str | None
    market_cap: int | None
    sector: str | None
    day_high: float | None
    day_low: float | None
    fifty_two_week_high: float | None
    fifty_two_week_low: float | None
    pe_ratio: float | None
    dividend_yield: float | None


class AddToWatchlistResponse(WatchlistItemResponse):
    pass


class RemoveFromWatchlistResponse(BaseModel):
    message: str
    ticker: str
