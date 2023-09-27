import requests
import json
import os

from settings import SETTINGS
from config import Config
from helpers.ReadData import read_data
from helpers.SendData import send_data
from helpers.SaveData import save_data

if __name__ == "__main__":
    #create directory for data entrys
    if not os.path.isdir('enviro-data'):
        os.makedirs('enviro-data')

    conf = Config(SETTINGS)
    conf.activateFan()
        
    if SETTINGS["save_data"]:
        save_data(data)
    
    #trys to send weather data to the server
    #handles errors when there is no server
    if SETTINGS["send_data"]:
        ip = SETTINGS["ip_address"]
        port = SETTINGS["server_port"]
        data = read_data()
        json_data = json.dumps(data)
        
        try:
            send_data(ip, port, json_data)
        except:
            print("Can't connect to server!")    