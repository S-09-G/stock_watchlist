import yfinance as yf

from schemas.stock import StockDetail


def get_stock_detail(ticker: str) -> StockDetail | None:
    stock = yf.Ticker(ticker)
    info = stock.info

    # yfinance returns a dict even for invalid tickers but lacks identifying fields
    if not info.get("shortName"):
        return None

    return StockDetail(
        ticker=ticker.upper(),
        company_name=info.get("shortName"),
        current_price=info.get("currentPrice"),
        currency=info.get("currency"),
        market_cap=info.get("marketCap"),
        sector=info.get("sector"),
        day_high=info.get("dayHigh"),
        day_low=info.get("dayLow"),
        fifty_two_week_high=info.get("fiftyTwoWeekHigh"),
        fifty_two_week_low=info.get("fiftyTwoWeekLow"),
        pe_ratio=info.get("trailingPE"),
        dividend_yield=info.get("dividendYield"),
    )
