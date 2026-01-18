import os

class Config:
    DB_HOST = os.getenv("DB_HOST", "db")
    DB_USER = os.getenv("DB_USER", "user")
    DB_PASS = os.getenv("DB_PASS", "pass")
    DB_NAME = os.getenv("DB_NAME", "app")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
