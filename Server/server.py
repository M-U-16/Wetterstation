import os
from flask import Flask, render_template
from config import Config
import logging

#importing routes
from routes import api_router
from routes import app_router

app = Flask(__name__)
app.config.from_object(Config)
app.debug = True

app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True

#register app routes
app.register_blueprint(app_router.app_bp)
#register api router
app.register_blueprint(api_router.api_bp)

@app.errorhandler(404)
def page_not_found(error):
    """ 404 PAGE """
    return render_template("404.html")

if __name__ == '__main__':
    print()
    print("Server running at http://localhost:8080")
    app.run(host=app.config["HOST"], port=app.config["PORT"], use_reloader=True)