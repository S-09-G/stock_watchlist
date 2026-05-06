from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.db import get_db
from database.models import WatchlistItem
from schemas.stock import (
    AddToWatchlistResponse,
    RemoveFromWatchlistResponse,
    StockDetail,
    WatchlistItemResponse,
)
from services.stock_service import get_stock_detail

router = APIRouter(prefix="/api", tags=["stocks"])


@router.get("/watchlist", response_model=list[WatchlistItemResponse])
def get_watchlist(db: Session = Depends(get_db)):
    return db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()


@router.post(
    "/watchlist/{ticker}",
    response_model=AddToWatchlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_watchlist(ticker: str, db: Session = Depends(get_db)):
    ticker = ticker.upper()

    existing = db.query(WatchlistItem).filter(WatchlistItem.ticker == ticker).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{ticker} is already in your watchlist.",
        )

    stock = get_stock_detail(ticker)
    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticker '{ticker}' was not found. Please check the symbol and try again.",
        )

    new_item = WatchlistItem(
        ticker=stock.ticker,
        company_name=stock.company_name,
        current_price=stock.current_price,
        sector=stock.sector,
        currency=stock.currency,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.delete("/watchlist/{ticker}", response_model=RemoveFromWatchlistResponse)
def remove_from_watchlist(ticker: str, db: Session = Depends(get_db)):
    ticker = ticker.upper()

    item = db.query(WatchlistItem).filter(WatchlistItem.ticker == ticker).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{ticker} is not in your watchlist.",
        )

    db.delete(item)
    db.commit()

    return RemoveFromWatchlistResponse(
        message=f"{ticker} has been removed from your watchlist.",
        ticker=ticker,
    )


@router.get("/stock/{ticker}", response_model=StockDetail)
def get_stock_info(ticker: str):
    stock = get_stock_detail(ticker)
    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticker '{ticker.upper()}' was not found.",
        )
    return stock


@router.post("/watchlist/{ticker}/refresh", response_model=WatchlistItemResponse)
def refresh_stock_price(ticker: str, db: Session = Depends(get_db)):
    ticker = ticker.upper()

    item = db.query(WatchlistItem).filter(WatchlistItem.ticker == ticker).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{ticker} is not in your watchlist.",
        )

    stock = get_stock_detail(ticker)
    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not fetch latest data for {ticker}.",
        )

    item.current_price = stock.current_price
    db.commit()
    db.refresh(item)

    return item
