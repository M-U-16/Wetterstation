import platform
import pathlib
import sqlite3
import json
import sys
import os

#get the os type and store in variable
os_type = platform.system()
#directory name for database files
database_directory = "data"

""" ---------------CREATING DIRECTORY STRUCTURE FOR DATA------------- """
#creates new directory for data with given path
def createDatabaseDirectory(path):
    directory_path = f"{path}/{database_directory}"
    #checks if directory for db files already exists    
    if not os.path.exists(directory_path):
        os.mkdir(directory_path)
        print(f"Created '{database_directory}'")
        
        #saving path of database_diretory in server_settings.json
        settings_path = f"{path}/server_settings.json"
        print(settings_path)
        with open(settings_path,"r+") as file:
            content = file.read()
            file.seek(0)
            file.truncate()
            content_dict = json.loads(content)
            content_dict["data_dir"] = directory_path
            file.write(json.dumps(content_dict))
    else:
        print(f"'{database_directory}' Directory already exists!")

    #checks if directory for db files already exists    
    if not os.path.exists(directory_path + "/wetter.db"):
        sqlite3.connect(directory_path + "/wetter.db")
        print("Database file was successfully created!")
        create_wetterdaten_table(directory_path + "/wetter.db")
        print("Table was successfully created!")
    else: print("Database file already exists!")

    
""" --------------CREATING THE FIRST DATABASE------------------------ """
#creates a table with the appropriate schema
def create_wetterdaten_table(path):
    con = sqlite3.connect(path)
    with open("schema.sql", "r") as f:
        con.executescript(f.read())
        
#get the path to the Server project directory
def getServerPath():
    #get path to server directory
    #depending on os_type
    if os_type == "Windows":
        path_list = os.getcwd().split("\\")
    elif os_type == "Linux":
        path_list = str(pathlib.Path().resolve()).split("/")
    else:
        print("Error | OS not supported!")
        sys.exit(1)
    
    if len(path_list) == 0: return
    
    while path_list[-1] != "Server":
        path_list.pop()
        
    return "/".join(path_list)

def main():
    server_path = getServerPath() 
    #save complete path to db file directory
    createDatabaseDirectory(server_path)
    
if __name__ == "__main__":
    main()