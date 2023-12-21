from apps import socketio
from config import Config
from apps import create_app

app = create_app(Config)

if __name__ == "__main__":
    app.run(
        port=app.config["PORT"],
        host=app.config["HOST"]
    )