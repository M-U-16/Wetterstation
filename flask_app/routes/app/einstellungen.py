from flask import Blueprint, render_template

einstellungen_route = Blueprint(
    "einstellungs_route",
    __name__,
    template_folder="templates",
    static_folder="static"
)

@einstellungen_route.route("/einstellungen")
def einstellungen():
    return render_template("settings.html")