import os
from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from MySQLdb

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB = MySQLdb.connect(
    host=os.getenv("DB_HOST", "db"),
    user=os.getenv("DB_USER", "user"),
    password=os.getenv("DB_PASSWORD", "pass"),
    db=os.getenv("DB_NAME", "app"),
    charset="utf8mb4",
    autocommit=True
)


