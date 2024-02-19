import os

# --- load settings for flask from env file --- #
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
ENV = os.getenv("ENV")
SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
PI_KEY = os.getenv("PI_KEY")
DEBUG = os.getenv("DEBUG") or False
BASE_DIR = str(os.path.dirname(__file__))
DATA_DIR = os.getenv("DATA_DIR")
TEMPLATES_AUTO_RELOAD = os.getenv("TEMPLATES_AUTO_RELOAD") or False