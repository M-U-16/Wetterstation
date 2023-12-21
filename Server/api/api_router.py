from flask import Blueprint
from api.endpoints.settings import settings_route
from api.endpoints.graph import graph_route
from api.endpoints.wetterdaten import wetterdaten_route

api_bp = Blueprint("api_route", __name__, url_prefix="/api")

api_bp.register_blueprint(settings_route)
api_bp.register_blueprint(graph_route)
api_bp.register_blueprint(wetterdaten_route)