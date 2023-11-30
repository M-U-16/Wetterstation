import sqlite3
import platform
import os
import pathlib

#Database Path = ../wetter.db
#creates a table with the appropriate schema
def create_wetterdaten_table(path):
    con = sqlite3.connect(path)
    with open("schema.sql", "r") as f:
        con.executescript(f.read())
        
#get the path to the Server project directory
def getServerPath(dir_array=""):
    if dir_array == "": return
    
    while dir_array[-1] != "Server":
        dir_array.pop()
        
    return "/".join(dir_array)

def main():
    #get the os type and store in variable
    os_type = platform.system()
    server_path = ""
    path = ""
    
    #get path to server directory
    #depending on os_type
    if os_type == "Windows":
        path = os.getcwd().split("\\")
        server_path = getServerPath(path)
    elif os_type == "Linux":
        path = pathlib.Path().resolve().split("/")
        server_path = getServerPath(path)
    else:
        print("Type of operating system is not supported!")
        return
        
    if not os.path.exists(server_path + "/wetter.db"):
        sqlite3.connect(server_path + "/wetter.db")
        print("Database file was successfully created!")
        create_wetterdaten_table(server_path + "/wetter.db")
        print("Table was successfully created!")
    else:
        print("Database file already exists!")
    
main()