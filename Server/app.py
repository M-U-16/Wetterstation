import os
import dotenv
# config import
import settings.env_config as config


ENV_PATH = dotenv.find_dotenv(".env.dev")
os.environ["ENV_PATH"] = ENV_PATH
dotenv.load_dotenv(dotenv_path=ENV_PATH, override=True, verbose=True)

# flask and flask utils
from flask import Flask
from flask_cors import CORS
# socketio
from api.events import socketio
# api endpoints
from api.api_router import api_bp
# commands
from command import register_commands
# views
from views.home import blueprint as home_bp
from views.admin import blueprint as admin_bp
from views.dashboard import blueprint as dasboard_bp

def register_extensions(app):
    socketio.init_app(app)

def register_blueprints(app):
    app.register_blueprint(admin_bp)
    app.register_blueprint(dasboard_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(api_bp)

def create_app():
    app = Flask(__name__, template_folder="temps")
    app.config.from_object(config)
    #configuring cors
    app.config["CORS_HEADERS"] = "Content-Type"
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    register_blueprints(app)
    register_extensions(app)
    register_commands(app)
    
    return app