import platform
import pathlib
import sqlite3
import sys
import os

#get the os type and store in variable
OS_TYPE = platform.system()
#directory name for database files
DATA_DIRECTORY = "data"
#name for creating the initial database
INITIAL_DB_NAME = "wetter.sqlite3"

def checkPaths(obj):
    for key in obj.keys():
        if (
            os.path.exists(obj[key]) and
            key != "server_path"
        ): sys.exit(f"Error | Path: '{obj[key]}' already exists")

""" ---------------CREATING DIRECTORY STRUCTURE FOR DATA------------- """
#creates new directory for data with given path
def createDatabaseDirectory(path):
    directory_path = f"{path}/{DATA_DIRECTORY}"
    #create the directory
    os.mkdir(directory_path)  
    #printing success message to terminal
    print(f"Created '{DATA_DIRECTORY}' directory!")
    return directory_path
    
""" --------------CREATING THE FIRST DATABASE------------------------ """
#creates a table with the appropriate schema
def createInitialDatabase(path):
    #creating the database file
    conn = sqlite3.connect(path)
    conn.close()

#get the path to the Server project directory
def getServerPath():
    #get path to server directory
    #depending on OS_TYPE
    if OS_TYPE == "Windows":
        path_list = os.getcwd().split("\\")
    elif OS_TYPE == "Linux":
        path_list = str(pathlib.Path().resolve()).split("/")
    else:
        sys.exit("Error | OS NOT SUPPORTED OR ERROR IN setup.py FILE |")
    while path_list[-1] != "Server":
        path_list.pop()
    return "/".join(path_list)

def getAllPaths():
    all_paths = {}
    all_paths["server_path"] = getServerPath()
    all_paths["data_directory"] = f"{all_paths['server_path']}/{DATA_DIRECTORY}"
    all_paths["db_path"] = f"{all_paths['data_directory']}/{INITIAL_DB_NAME}"
    return all_paths

def main():
    try:
        #get complete path to server project directory
        new_paths = getAllPaths()
        checkPaths(new_paths)
        createDatabaseDirectory(new_paths["server_path"])
        createInitialDatabase(new_paths["db_path"])
    
    except Exception as e:
        print("error: ", e)
    
if __name__ == "__main__":
    main()