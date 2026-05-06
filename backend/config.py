from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    allowed_origins: list[str] = ["http://localhost:5173"]
    app_title: str = "Stock Watchlist API"
    debug: bool = False

    # How often the background scheduler refreshes watchlist prices
    refresh_interval_minutes: int = 5

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
