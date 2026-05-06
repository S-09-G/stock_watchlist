from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func

from database.db import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String(20), unique=True, nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    current_price = Column(Numeric(12, 4), nullable=True)
    sector = Column(String(100), nullable=True)
    currency = Column(String(10), nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<WatchlistItem {self.ticker}>"
