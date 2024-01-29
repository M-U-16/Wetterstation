# config import
import env_config
# commands
from command import register_commands
# flask and flask utils
from flask_cors import CORS
from flask import Flask, render_template
from playhouse.flask_utils import FlaskDB
# views
from views.home import blueprint as home_bp
from views.admin import blueprint as admin_bp
from views.dashboard import blueprint as dasboard_bp
# api endpoints
from api.api_router import api_bp
from models.model import db


# socketio
from api.events import socketio

def register_extensions(app):
    socketio.init_app(app)

def register_blueprints(app):
    for module in (
        admin_bp,
        dasboard_bp,
        home_bp,
        api_bp
    ):
        app.register_blueprint(module)

def create_app():
    app = Flask(__name__, template_folder="temps")
    app.config.from_object(env_config)
    #configuring cors
    app.config["CORS_HEADERS"] = "Content-Type"
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    register_blueprints(app)
    register_extensions(app)
    register_commands(app)
    
    return app