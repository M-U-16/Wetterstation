import os
import sys
import click
import dotenv
import sqlite3
from pathlib import Path
from helpers.server_path import getServerPath
from models.model import create_tables, random_populate_db

# loading .env file needs verbose and override
# if not set variables changed after loading are not available
dotenv_file = dotenv.find_dotenv(os.environ["ENV_FILE"])
dotenv.load_dotenv(dotenv_path=dotenv_file, verbose=True, override=True)

def checkPaths(obj):
    for key in obj.keys():
        if (os.path.exists(obj[key]) and key != "server_path"):
            sys.exit(f"Error | Path: '{obj[key]}' already exists")

def handleExistingPath(path_type, name):
    message = f">> {path_type} '{name}' already exists!\n Create next? (J/N):"
    if input(message) == "J": return True
    sys.exit(">> Programm stopped!")

def createInitialDatabase(path):
    #creating the database file
    conn = sqlite3.connect(path)
    conn.close()

forward_slash = lambda path: "/".join(path.split("\\"))
def setEnv(key, value): dotenv.set_key(dotenv_file, key, value)
def generatePath(path, name): return str(Path(path, name))
def checkPath(path, name):
    if os.path.exists(path):
        return False
    return True

def createDir(name="data"):
    #creating the path to the directory
    path = generatePath(getServerPath(), name)
    if checkPath(path, name):
        #creating the directory
        os.mkdir(path)
        setEnv("DATA_DIR", forward_slash(path))
    else: handleExistingPath("Directory", name)
    

def createDb(name="wetter.sqlite3"):
    path = generatePath(os.getenv("DATA_DIR"), name)
    if checkPath(path, name):
        sqlite3.connect(path).close()
        setEnv("DATABASE_PATH", forward_slash(path))
    else: handleExistingPath("Database file", name)
    
def createTables():
    create_tables()
def populateDb(amount):
    random_populate_db(amount)
    
def create_default():
    createDir()
    createDb()
    create_tables()
""" 
FLASK CLI FOR CREATING BASE FILE STRUCTURE
FOR DATA STORAGE
"""

def register_commands(app):
    @app.cli.command("create-data-dir")
    @click.argument("name")
    def cli_createDir(name):
        """ CREATES A NEW DATA DIRECTORY """
        createDir(name)

    @app.cli.command("create-db")
    @click.argument("name")
    def cli_createDb(name):
        """ 
            CREATES A NEW DATABASE IN
            THE DATA DIRECTORY
        """
        createDb(name)
        
        
    @app.cli.command("create-tables")
    def cli_createTables():
        """ 
            CREATES A ALL TABLES IN THE DATABASE
        """
        create_tables()
        
    @app.cli.command("populate-db")
    @click.option("-a", "--amount", type=click.INT, default=365)
    def cli_populate_db(amount):
        """ 
            COMMAND FOR INSERTING RANDOM VALUES IN
            THE DATABASE FOR TESTING PURPOSES
        """
        populateDb(amount)
    
    @app.cli.command("create-default")
    def cli_create_default():
        
        """ 
            COMMAND FOR CREATING DEFAULT DATA DIRECTORY,
            DATABASE AND TABLES
        """
        create_default()