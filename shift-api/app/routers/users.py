from flask import Blueprint, jsonify, request
from app.database import get_db

bp = Blueprint("users", __name__, url_prefix="/api/users")

@bp.get("")
def list_users():
    """List all staff."""
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, name, email, role, line_user_id, created_at FROM users ORDER BY id")
        rows = cur.fetchall()
    return jsonify({"ok": True, "items": rows})

@bp.post("")
def create_user():
    """Create a new staff member."""
    body = request.json or {}
    name = body.get("name")
    email = body.get("email")
    role = body.get("role", "crew")

    if not name:
        return jsonify({"ok": False, "error": "name required"}), 400

    with get_db() as conn, conn.cursor() as cur:
        cur.execute("INSERT INTO users(name, email, role) VALUES(%s, %s, %s)", (name, email, role))
        new_id = cur.lastrowid
        cur.execute("SELECT * FROM users WHERE id=%s", (new_id,))
        row = cur.fetchone()

    return jsonify({"ok": True, "user": row}), 201
