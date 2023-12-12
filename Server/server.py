from flask import Flask, render_template
import logging
import json

#importing routes
from routes.app import einstellungen, wetter
from routes import api_router

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True

#load settings in conf
settings_string = open("./server_settings.json", "r").read()
settings_json = json.loads(settings_string)
for config in settings_json:
    app.config[config] = settings_json[config]

#register app routes
app.register_blueprint(wetter.wetter_route)
app.register_blueprint(einstellungen.einstellungen_route)
#register api router
app.register_blueprint(api_router.api_route)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=8080, use_reloader=True)