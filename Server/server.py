from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import Migrate
from config import Config
import logging

#importing routes
from routes.app import einstellungen, wetter
from routes import api_router

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True

#register app routes
app.register_blueprint(wetter.wetter_route)
app.register_blueprint(einstellungen.einstellungen_route)
#register api router
app.register_blueprint(api_router.api_route)

#index route
@app.route("/")
def index():
    return render_template("index.html") 

if __name__ == '__main__':
    print("Server running at http://localhost:8080")
    app.run(debug=True, host="localhost", port=8080, use_reloader=True)