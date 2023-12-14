from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
import logging

#importing routes
from routes import api_router
from routes import app_router

app = Flask(__name__)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config.from_object(Config)
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True

#register app routes
app.register_blueprint(app_router.app_bp)
#register api router
app.register_blueprint(api_router.api_bp)

#index route
@app.route("/")
def index():
    return render_template("index.html") 

if __name__ == '__main__':
    print()
    print("Server running at http://localhost:8080")
    app.run(debug=True, host=app.config["HOST"], port=app.config["PORT"], use_reloader=True)