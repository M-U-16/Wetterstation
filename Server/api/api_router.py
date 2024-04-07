from flask import Blueprint, render_template, request
from api.endpoints.data import data_route
from api.endpoints.wetterdaten import wetterdaten_route
from api.endpoints.entrys import entry_route

api_bp = Blueprint("api_route", __name__, url_prefix="/api")

api_bp.register_blueprint(data_route)
api_bp.register_blueprint(wetterdaten_route)
api_bp.register_blueprint(entry_route)

@api_bp.route("/partial")
def partials():
    print("partials", request)
    return render_template("partials/test.html")