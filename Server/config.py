import os
from dotenv import load_dotenv
#loading variables from .env file
load_dotenv()
#true or false depending on .env file ENV variable
isInDevelopment = True if os.getenv("ENV") == "development" else False
forward_slash = lambda path: "/".join(path.split("\\"))   

class Config(object):
    BASE_DIR = os.path.dirname(__file__)
    DATA_DIR = "data"
    DATABASE_NAME = "wetter.sqlite3"
    DATABASE_PATH = f"{BASE_DIR}\{DATA_DIR}\{DATABASE_NAME}"
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ENV = os.getenv("ENV")
    DEBUG = isInDevelopment
    TEMPLATES_AUTO_RELOAD = isInDevelopment
    SECRET_KEY = os.getenv("SECRET_KEY")
    #FLASKDB_EXCLUDED_ROUTES = ("/")
    