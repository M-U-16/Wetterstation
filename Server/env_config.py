import os
import sys
from dotenv import load_dotenv

# check for env-path enviroment variable
# that is needed to configure the server

if os.getenv("env-name"):
    load_dotenv(os.getenv("env-name"))
else:
    print(">> No .env path specified > running with '.env.dev' file")
    load_dotenv(".env.dev")

# check if data dir and database variables exist
# exits programm start if not
""" if not os.getenv("DATA_DIR"):
    sys.exit("Error | CAN'T FIND DATA_DIR IN env FILE!")
if not os.getenv("DATABASE_PATH"):
    sys.exit("Error | CAN'T FIND DATABASE_PATH IN env FILE!") """

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