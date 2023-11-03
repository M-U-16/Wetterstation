from flask import Blueprint, render_template
wetter_route = Blueprint(
    "wetter_route",
    __name__,
    static_folder="static",
    template_folder="templates"
)

@wetter_route.route('/wetter')
def wetter():
    return render_template("wetter.html",
        gas_sensor="gas_sensor",
        particulate_sensor="particulate_sensor",
        fan_gpio="fan_gpio"
    )