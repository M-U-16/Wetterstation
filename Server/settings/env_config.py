import os
import dotenv
from settings import ENV_FILE

os.environ["ENV_FILE"] = ENV_FILE
# check for env-path enviroment variable
# that is needed to configure the server
dotenv.load_dotenv(ENV_FILE)
print(os.getcwd())
if os.getenv("DEBUG"): print(f">> Loading settings from '{ENV_FILE}'")

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
DATABASE_PATH = os.getenv("DATABASE_PATH")