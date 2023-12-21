from flask import Blueprint, render_template

blueprint = Blueprint(
    "dashboard_bp",
    __name__,
    url_prefix=""
)

@blueprint.route("/wetter")
def dashboard():
    return render_template("wetter.html")