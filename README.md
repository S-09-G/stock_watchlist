# Stock Watchlist

A full-stack stock watchlist application. Add ticker symbols to a personal watchlist, track live prices, and view detailed financial metrics. Prices refresh automatically every 5 minutes in the background via APScheduler; users can also trigger a manual refresh per stock.

## Architecture

```
stock-watchlist/
├── backend/          # FastAPI REST API
│   ├── database/     # SQLAlchemy models and session management
│   ├── schemas/      # Pydantic request/response schemas
│   ├── routes/       # API endpoint definitions
│   ├── services/     # yfinance integration and background scheduler
│   └── alembic/      # Database migrations
└── frontend/         # React + Vite SPA
    └── src/
        ├── api/       # Typed API client
        ├── components/
        ├── pages/
        ├── styles/
        └── utils/
```

**Backend:** FastAPI, SQLAlchemy 2.0, PostgreSQL, yfinance, APScheduler, Alembic  
**Frontend:** React 19, Vite, plain CSS

## API Reference

All routes are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/watchlist` | List all watchlist items |
| `POST` | `/watchlist/{ticker}` | Add a stock by ticker symbol |
| `DELETE` | `/watchlist/{ticker}` | Remove a stock |
| `GET` | `/stock/{ticker}` | Fetch live detail for any ticker |
| `POST` | `/watchlist/{ticker}/refresh` | Manually refresh price for a watchlist item |

**Status codes:**
- `201` on successful add
- `404` if ticker is invalid or not in watchlist
- `409` if ticker is already in watchlist
- `503` if the upstream price fetch fails

**Detail response fields** (`GET /stock/{ticker}`): `current_price`, `market_cap`, `sector`, `day_high`, `day_low`, `week_52_high`, `week_52_low`, `pe_ratio`, `dividend_yield`, `currency`

## Features

- Add and remove stocks by ticker symbol
- Background price refresh on a configurable interval (APScheduler)
- Per-stock manual price refresh
- Detailed modal: market cap, P/E, 52-week range, dividend yield
- Search by ticker or company name
- Sort by date added, ticker, or price
- Sector badges with consistent color mapping
- Auto-polls the API every 60 seconds; re-fetches on tab focus
- Toast notifications for all user actions

