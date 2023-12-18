from flask import Flask, render_template
from config import Config

#importing routes
from routes import api_router
from routes import app_router

app = Flask(__name__)
app.config.from_object(Config)

from models.model import peewee_db

#register app routes
app.register_blueprint(app_router.app_bp)
#register api routes
app.register_blueprint(api_router.api_bp)

print(app.config["DATABASE_PATH"])

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")

if __name__ == '__main__':
    print("Server running at http://localhost:8080")
    app.run(
        host=app.config["HOST"],
        port=app.config["PORT"],
        use_reloader=app.config["TEMPLATES_AUTO_RELOAD"]
    )