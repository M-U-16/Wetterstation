from flask import Blueprint, render_template

blueprint = Blueprint(
    "home_bp",
    __name__,
    url_prefix=""
)

@blueprint.route("/")
def index_route():
    return render_template("pages/index.html")