from flask import Blueprint, render_template, request

blueprint = Blueprint(
    "dashboard_bp",
    __name__,
    url_prefix=""
)

@blueprint.route("/dashboard")
def dashboard():
    print("view param: ", request.args["view"])
    return render_template("dashboard.html")