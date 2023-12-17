import os
from dotenv import load_dotenv
#loading variables from .env file
load_dotenv()
#true or false depending on .env file ENV variable
isInDevelopment = True if os.getenv("ENV") == "development" else False

class Config(object):
    DATABASE_DIR = "data"
    DATABASE_NAME = "wetter.sqlite3"
    BASE_DIR = os.path.dirname(__file__)
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ENV = os.getenv("ENV")
    DEBUG = isInDevelopment
    TEMPLATES_AUTO_RELOAD = isInDevelopment
    SECRET_KEY = os.getenv("SECRET_KEY")
    #FLASKDB_EXCLUDED_ROUTES = ("/")