import os

# config import
from settings import load_config
load_config(os.getenv("ENV_FILE"))
# -------------
from app import create_app
app = create_app()

if __name__ == "__main__":
    app.run(port=app.config["PORT"],host=app.config["HOST"])