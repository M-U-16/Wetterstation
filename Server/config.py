import os
from pathlib import Path
from dotenv import load_dotenv

#loading variables from .env file
load_dotenv()
#true or false depending on .env file ENV variable
isInDevelopment = True if os.getenv("ENV") == "development" else False

class Config(object):
    BASE_DIR = str(os.path.dirname(__file__))
    DATA_DIR = os.getenv("DATA_DIR")
    
    DATABASE_NAME = os.getenv("DATABASE_NAME") or "wetter.sqlite3"
    DATABASE = ""
    
    SECRET_KEY = os.getenv("SECRET_KEY")
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ENV = os.getenv("ENV")
    
    DEBUG = isInDevelopment
    TEMPLATES_AUTO_RELOAD = isInDevelopment
    #FLASKDB_EXCLUDED_ROUTES = ("/")
    