import os
import sys
baseDir = os.path.abspath(os.path.dirname(__file__))
print(baseDir)

if not os.path.exists("./data"):
    sys.exit("Error | Database directory does not exists!")

class Config(object):
    HOST = os.environ.get("HOST") or "localhost"
    PORT = os.environ.get("PORT") or 8080
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite://" + os.path.join(baseDir, "wetter.db")
    TEMPLATES_AUTO_RELOAD = os.environ.get("AUTO_RELOAD") or True
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get("TRACK_MODIFICATIONS") or False
    