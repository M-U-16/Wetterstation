import os
import secrets
from config import load_config

# flask and flask utils
from flask import Flask
from flask_cors import CORS
# socketio
from api.events import socketio
# api endpoints
from api import api_bp
# views
from views.home import blueprint as home_bp
from views.admin import blueprint as admin_bp
from views.backup import blueprint as backup_bp
from views.suchen import blueprint as suchen_bp
from views.dashboard import blueprint as dasboard_bp
from views.messugen import blueprint as messungen_bp

from models import close_db
from models.meta import close_meta_db

def register_extensions(app):
    socketio.init_app(app)

def register_blueprints(app):
    app.register_blueprint(api_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(backup_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(suchen_bp)
    app.register_blueprint(dasboard_bp)
    app.register_blueprint(messungen_bp)

def create_app():
    app = Flask(__name__)
    
    # config
    ENV_FILE = os.getenv("ENV_FILE", ".env.dev")
    if ENV_FILE == ".env.dev":
        if os.getenv("ENV", "development") == "production":
            print("ERROR: Mode is 'production' can't use '.env.dev' as env file")
            exit(1)
        print("INFO: Running in development mode")
        print("INFO: Running with .env.dev")

    load_config(ENV_FILE)
    app.config.from_prefixed_env()
    
    app.teardown_appcontext(close_meta_db)
    app.teardown_appcontext(close_db)

    #configuring cors
    app.config["CORS_HEADERS"] = "Content-Type"
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    register_blueprints(app)
    register_extensions(app)
    
    return app