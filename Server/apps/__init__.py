import os
import peewee as pw
from apps.command import register_commands
from flask import Flask, render_template
from apps.home import blueprint as home_bp
from apps.admin import blueprint as admin_bp
from apps.dashboard import blueprint as dasboard_bp

from dotenv import load_dotenv
from playhouse.flask_utils import FlaskDB
from api.events import socketio

load_dotenv()
db = FlaskDB()

def register_extensions(app):
    socketio.init_app(app)

def register_blueprints(app):
    for module in (admin_bp, dasboard_bp, home_bp):
        app.register_blueprint(module)

def configure_database(app):
    @app.before_first_request
    def init():
        pass
        #db.init_app(app)
        
    @app.teardown_request
    def shutdown_session(exception=None):
        db.session.remove()

def setup_app(app):
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    register_blueprints(app)
    register_extensions(app)
    register_commands(app)
    setup_app(app)
    
    return app