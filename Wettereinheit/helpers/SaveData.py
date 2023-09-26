import os
import pathlib
import json
import shutil

SAVE_DIRECTORY = "enviro-data"

def make_path(items, directory=""):
    path = ""
    for item in items:
        path += f"{item}//"
    return path + directory

def get_path_list(path):
    new_path = path.split("\\")
    new_path.pop()
    return new_path

def removeDirs(dir_list, path):
    for name in dir_list:
        shutil.rmtree(path)

def createFile(file_path):
    if not os.path.isfile(file_path):
        f = open(file_path, "w")
        f.write('{\n  "samples": []\n}')
        f.close()
  
def jsonFormater(data):
    file_string = json.dumps(data)
    new_json = ""
    for index, letter in enumerate(file_string):
        if letter == "{":
            new_json += f"{letter}\n"
        elif letter == ",":
            new_json += f"{letter}\n"
        elif letter == "[":
            new_json += f"{letter}\n"
        else:
            new_json += letter
    return new_json
                
        
def addEntry(file_path, file_data, data):
    print(file_data, data)
    file_data["samples"].append(data)
    
    f = open(file_path, "w")
    f.write(jsonFormater(file_data))
    f.close()
    
def readEntry(file_path):
    f = open(file_path, "r")
    file_content = json.loads(f.read())
    f.close()
    return file_content

def save_data(data):
    
    date = data["time"]
    date_list = date.split(" ")
    time = "-".join(date_list[3].split(":"))
    entry_year = date_list[4]
    entry_month =  date_list[1]
    entry_day = date_list[0] + "--" + date_list[2]
    
    #create proper file name out of date value
    file_name = ""
    for index, entry in enumerate(date_list):
        if ":" in entry:
            file_name += time
        else:
            file_name += entry
        if not index == len(date_list) - 1:
            file_name += "--"
    
    year_path = f"{SAVE_DIRECTORY}/{entry_year}"
    month_path = f"{year_path}/{entry_month}"
    file_path = f"{month_path}/{entry_day}.json"
    
    #removeDirs(dir_list, year_path)
    
    if not os.path.isdir(year_path):
        os.makedirs(year_path)
    if not os.path.isdir(month_path):
        os.makedirs(month_path)
    
    createFile(file_path)
    lastEntry = readEntry(file_path)
    addEntry(file_path, lastEntry, data)
    
    