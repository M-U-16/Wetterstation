from flask import Blueprint
from .api.settings import settings_route
from .api.graph import graph_route

api_route = Blueprint("api_route", __name__, url_prefix="/api")

api_route.register_blueprint(settings_route)
api_route.register_blueprint(graph_route)