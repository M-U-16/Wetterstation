import os
import pathlib

save_directory = "enviro-data"

def make_path(items, directory=""):
    path = ""
    for item in items:
        path += f"{item}//"
    return path + directory

def get_path(path):
    new_path = path.split("\\")
    new_path.pop()
    return new_path

def save_data(data):
    p = str(pathlib.Path(__file__))
    p = make_path(get_path(p), save_directory)
    dir_list = os.listdir(p)
    
    print(os.path("./eviro-data"))