import os
from dotenv import load_dotenv
from pathlib import Path
#loading variables from .env file
load_dotenv()
#true or false depending on .env file ENV variable
isInDevelopment = True if os.getenv("ENV") == "development" else False
forward_slash = lambda path: "/".join(path.split("\\"))   

class Config(object):
    BASE_DIR = str(os.path.dirname(__file__))
    DATA_DIR = os.getenv("DATA_DIR")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    DATABASE_PATH = Path(BASE_DIR, DATA_DIR, DATABASE_NAME)
    SECRET_KEY = os.getenv("SECRET_KEY")
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    ENV = os.getenv("ENV")
    DEBUG = isInDevelopment
    TEMPLATES_AUTO_RELOAD = isInDevelopment
    #FLASKDB_EXCLUDED_ROUTES = ("/")
    