from flask import Blueprint
from .app.wetter import wetter_route

app_bp = Blueprint("app_router", __name__)
app_bp.register_blueprint(wetter_route)