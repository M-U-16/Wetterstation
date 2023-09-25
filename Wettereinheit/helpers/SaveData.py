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

def save_data(data):
    p = str(pathlib.Path(__file__))
    p = get_path_list(p)
    p.pop() #remove last item of dir list
    p = make_path(p, SAVE_DIRECTORY)
    dir_list = os.listdir(p)
    
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
    file_path = f"{month_path}/{file_name}.json"
    
    #removeDirs(dir_list, year_path)
    
    if not os.path.isdir(year_path):
        os.makedirs(year_path)
    if not os.path.isdir(month_path):
        os.makedirs(month_path)
    
    new_file = open(file_path, "w")
    new_file.write(json.dumps(data))
    new_file.close()