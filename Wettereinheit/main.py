import requests
import json
import os
#imports for timing
#python schedule package
import schedule
import time

from settings import SETTINGS
from config import Config
from helpers.ReadData import read_data
from helpers.SendData import send_to_server
from helpers.SaveData import save_data

if SETTINGS["server"]:
    ip = SETTINGS["ip_address"]
    port = SETTINGS["server_port"]

conf = Config(SETTINGS)
conf.activateFan()
    
def startMeasuring():
    #gets the values from sensors
    data = read_data()
    #trys to send weather data to the server
    #handles errors when there is no server
    if SETTINGS["send_data"] and SETTINGS["server"]:
        json_data = json.dumps(data)
        endpoint = "wetterdaten"
        res = send_to_server(ip, port, endpoint, json_data, "wetter", "post")
        if SETTINGS["logging"]:
            print(res)
            
    if SETTINGS["send_pi_settings"] and SETTINGS["server"]:
        settings = {
            "gas_sensor": SETTINGS["gas_sensor"],
            "fan_gpio": SETTINGS["fan_gpio"],
            "particulate_sensor": SETTINGS["particulate_sensor"],
        }
        json_settings = json.dumps(settings)
        endpoint = "settings"
        res = send_to_server(ip, port, endpoint, json_settings, "settings", "post")
        if SETTINGS["logging"]:
            print(res)
    #here is the data being saved in files
    #-------------------------------------
    if SETTINGS["save_data"]:
        save_data(data)

if __name__ == "__main__":
    #create directory for data entrys if needed
    if not os.path.isdir('enviro-data'):
        os.makedirs('enviro-data')
        
    schedule.every(10).seconds.do(startMeasuring)
    
    while True:
        schedule.run_pending()
        time.sleep(1)
    
    