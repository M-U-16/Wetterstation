import logging
from flask import Flask, render_template
import json

#importing routes
from routes.app.einstellungen import einstellungen_route
from routes.app.wetter import wetter_route
from routes.api_router import api_route

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True

gas_sensor = None
particulate_sensor = None
fan_gpio = None

#load settings in conf
settings_string = open("./server_settings.json", "r").read()
settings_json = json.loads(settings_string)
for config in settings_json:
    app.config[config] = settings_json[config]

#register app routes
app.register_blueprint(wetter_route)
app.register_blueprint(einstellungen_route)
#register api routes
app.register_blueprint(api_route)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=80, use_reloader=True)