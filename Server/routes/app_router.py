from flask import Blueprint, render_template
from .views.wetter import wetter_route

app_bp = Blueprint("app_router", __name__)
app_bp.register_blueprint(wetter_route)

#index route
@app_bp.route("/")
def index():
    return render_template("index.html") 