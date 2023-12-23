from helpers.server_path import getServerPath
from models.model import create_tables, random_populate_db
from pathlib import Path
import sqlite3
import dotenv
import click
import sys
import os

dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

def checkPaths(obj):
    for key in obj.keys():
        if (os.path.exists(obj[key]) and key != "server_path"):
            sys.exit(f"Error | Path: '{obj[key]}' already exists")

def getAllPaths(dir_name, db_name):
    all_paths = {}
    all_paths["server_path"] = getServerPath()
    all_paths["data_directory"] = f"{all_paths['server_path']}/{dir_name}"
    all_paths["db_path"] = f"{all_paths['data_directory']}/{db_name}"
    return all_paths

def createInitialDatabase(path):
    #creating the database file
    conn = sqlite3.connect(path)
    conn.close()

forward_slash = lambda path: "/".join(path.split("\\"))
def setEnv(key, value): dotenv.set_key(dotenv_file, key, value)
def generatePath(path, name): return str(Path(path, name))
def checkPath(path, name):
    if os.path.exists(path):
        sys.exit(f"'{name}' already exists")

""" 
FLASK CLI FOR CREATING DIRECTORY FOR DATA
AND DATABASE
"""
DEFAULT_SETTINGS = {
    "data-dir": "data",
    "database_name": "wetter.sqlite3"
}

def register_commands(app):
    @app.cli.command("create-data-dir")
    @click.argument("name")
    def createDir(name):
        """ CREATES A NEW DATA DIRECTORY """
        #creating the path to the directory
        path = generatePath(getServerPath(), name)
        checkPath(path, name)
        #creating the directory
        os.mkdir(path)
        setEnv("DATA_DIR", forward_slash(path))

    @app.cli.command("create-db")
    @click.argument("name")
    def createDb(name):
        """ 
            CREATES A NEW DATABASE IN
            THE DATA DIRECTORY
        """
        path = generatePath(os.getenv("DATA_DIR"), name)
        checkPath(path, name)
        sqlite3.connect(path).close()
        setEnv("DATABASE_PATH", forward_slash(path))
        
    @app.cli.command("create-tables")
    def createDb():
        """ 
            CREATES A ALL TABLES IN THE DATABASE
        """
        create_tables()
        
    @app.cli.command("populate-db")
    def populate_db():
        """ 
            COMMAND FOR INSERTING RANDOM VALUES IN
            THE DATABASE FOR TESTING PURPOSES
        """
        random_populate_db()