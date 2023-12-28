from flask import Blueprint, render_template, request

blueprint = Blueprint(
    "dashboard_bp",
    __name__,
    url_prefix=""
)

views = {
    "diagramme": "dashboard/chart.html",
    "live-daten": "dashboard/live.html",
    "durchstöbern": "dashboard/search.html"
}

@blueprint.route("/dashboard")
def dashboard():
    try:
        view = request.args["ansicht"]
    except:
        view = ""
    
    if view == "diagramme":
        return render_template(
            views[view],
            active_content=view
        )
    if view == "live-daten":
        return render_template(
            views[view],
            active_content=view
        )
    if view == "durchstöbern":
        return render_template(
            views[view],
            active_content=view
        )
    
    return render_template(
        "pages/dashboard.html",
        active_content=view
    )