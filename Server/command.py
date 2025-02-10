import os
import sys
import click
import dotenv
import sqlite3

#from flask import current_app
#from helpers.server_path import getServerPath
from models.meta import get_meta_db
from models.model import create_tables, random_populate_db
from wsgi import app

#def forward_slash(path): return "/".join(path.split("\\"))
""" def update_env():
    path = os.getenv("ENV_PATH")
    dotenv.load_dotenv(dotenv_path=path, override=True) """

def populateDb(amount): random_populate_db(amount)
def set_env(key, value):
    os.environ[key] = value
    dotenv.set_key(os.getenv("ENV_PATH"), key, value)

def checkPaths(obj):
    for key in obj.keys():
        if (os.path.exists(obj[key]) and key != "server_path"):
            sys.exit(f"Error | Path: '{obj[key]}' already exists")

def handleExistingPath(path_type, name):
    message = f">> {path_type} '{name}' already exists!\n Create next? (J/N):"
    if input(message) == "J": return True
    sys.exit(">> Programm stopped!")
    
def checkPath(path, name):
    if os.path.exists(path):
        return False
    return True

def createDir(name="data"):
    with app.app_context():
        path = os.path.join(app.root_path, name)
        if checkPath(path, name):
            os.mkdir(path)
            set_env("DATA_DIR", path)
        else: handleExistingPath("Directory", name)

def createDb(envVarName, name):
    path = os.path.join(os.getenv("DATA_DIR"), name)
    print("createDb: path=", path)
    if checkPath(path, name):
        sqlite3.connect(path).close()
        set_env(envVarName, path)
    else: handleExistingPath("Database file", name)
    
def create_default():
    try:
        createDir()
        createDb(
            envVarName="FLASK_DATABASE",
            name="wetter.sqlite3"
        )
        create_tables(
            os.getenv("FLASK_DATABASE"),
            sql_file="wetter.sql"
        )
        
        createDb(
            envVarName="FLASK_META_DATABASE",
            name="meta.sqlite3"
        )
        create_tables(
            os.getenv("FLASK_META_DATABASE"),
            sql_file="meta.sql"
        )
        
        with app.app_context():
            devices_path = os.path.join(app.root_path, "devices")
            devices = os.listdir(devices_path)
            for device in devices:
                if "." not in device: continue
                
                device_file_path = os.path.join(devices_path, device)
                device_name, _ = device.split(".")
                print(device_name)
                
                db = get_meta_db()
                cursor = db.cursor()
                cursor.execute("INSERT INTO device_lookup(device_name) VALUES (?)", [device_name])
                device_id = cursor.execute("""
                    SELECT id FROM device_lookup WHERE device_name=?;
                """, [device_name]).fetchone()["id"]
                print(device_id)
                
                settings = []
                with open(device_file_path, "r", encoding="utf8") as file:
                    for line in file.readlines():
                        if "#" in line or "=" not in line: continue
                        setting = line.removesuffix("\n").split("=")
                        setting.insert(0, device_id)
                        settings.append(setting)
                
                print(settings)
                cursor.executemany("INSERT INTO device_settings(device_id, setting_name, setting_value) VALUES (?, ?, ?)", settings)
                db.commit()
                
    except Exception as e:
        print(e)
        exit(1)

@click.group()
def cli(): pass

@cli.command("create-data-dir")
@click.argument("name")
def cli_createDir(name):
    """ CREATES A NEW DATA DIRECTORY IN THE SERVER """
    createDir(name)

@cli.command("create-db")
@click.argument("name")
def cli_createDb(name):
    """ 
    CREATES A NEW DATABASE IN
    THE DATA DIRECTORY
    """
    createDb(name)
        
@cli.command("populate-db")
@click.option("-a", "--amount", type=click.INT, default=365)
def cli_populate_db(amount):
    """ 
    COMMAND FOR INSERTING RANDOM VALUES IN
    THE DATABASE FOR TESTING PURPOSES
    """
    populateDb(amount)
    
@cli.command("create-default")
def cli_create_default():
    """ 
    COMMAND FOR CREATING DEFAULT DATA DIRECTORY,
    DATABASE AND TABLES
    """
    create_default()

if __name__ == "__main__":
    cli()