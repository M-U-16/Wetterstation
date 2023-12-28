from app import socketio
from config import Config
from app import create_app

app = create_app(Config)

if __name__ == "__main__":
    socketio.run(
        app,
        port=app.config["PORT"],
        host=app.config["HOST"]
    )