from flask import Flask, jsonify
from flask_cors import CORS
from app.database import close_db

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Teardown
    app.teardown_appcontext(close_db)

    # Health Check
    @app.get("/health")
    def health():
        return jsonify({"ok": True, "status": "modular_backend_running"})

    # Register Blueprints
    from app.routers import auth, users, manager, staff
    app.register_blueprint(auth.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(manager.bp)
    app.register_blueprint(staff.bp)

    return app
