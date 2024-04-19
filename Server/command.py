import os
import sys
import click
import dotenv
import sqlite3
from pathlib import Path
from os.path import join as path_join
from helpers.server_path import getServerPath
from models.model import create_all_tables, random_populate_db

def updateEnv(func):
    def func_wrapper(*args, **kwargs):
        path = os.getenv("ENV_PATH")
        dotenv.load_dotenv(dotenv_path=path, override=True)
        func(*args, **kwargs)
    return func_wrapper

def checkPaths(obj):
    for key in obj.keys():
        if (os.path.exists(obj[key]) and key != "server_path"):
            sys.exit(f"Error | Path: '{obj[key]}' already exists")

def handleExistingPath(path_type, name):
    message = f">> {path_type} '{name}' already exists!\n Create next? (J/N):"
    if input(message) == "J": return True
    sys.exit(">> Programm stopped!")

forward_slash = lambda path: "/".join(path.split("\\"))
def setEnv(key, value): dotenv.set_key(os.getenv("ENV_PATH"), key, value)
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

@updateEnv
def createDb(envVarName, name="wetter.sqlite3"):
    path = generatePath(os.getenv("DATA_DIR"), name)
    if checkPath(path, name):
        sqlite3.connect(path).close()
        setEnv(envVarName, forward_slash(path))
        os.environ[envVarName] = dotenv.get_key(os.getenv("ENV_PATH"), envVarName)
    else: handleExistingPath("Database file", name)

def populateDb(amount):
    random_populate_db(amount)
    
def create_default():
    createDir()
    createDb(envVarName="WETTER_DATABASE_PATH" ,name="wetter.sqlite3")
    create_all_tables(os.getenv("WETTER_DATABASE_PATH"), schema="wetter_tbs")
    createDb(envVarName="DATA_DATABASE_PATH", name="data.sqlite3")
    create_all_tables(os.getenv("DATA_DATABASE_PATH"), schema="data_tbs")
    
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
        create_all_tables()
        
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