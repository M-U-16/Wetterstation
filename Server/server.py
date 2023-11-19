import logging
from flask import Flask, render_template
from server_settings import SERVER_SETTINGS

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
for config in SERVER_SETTINGS:
    app.config[config] = SERVER_SETTINGS[config]

#config for database
DATABASE = "./wetter.db"

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