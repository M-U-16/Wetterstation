import requests
import json
import os

from settings import SETTINGS
from config import Config
from helpers.ReadData import read_data
from helpers.SendData import send_to_server
from helpers.SaveData import save_data

if SETTINGS["server"]:
    ip = SETTINGS["ip_address"]
    port = SETTINGS["server_port"]

if __name__ == "__main__":
    #create directory for data entrys
    if not os.path.isdir('enviro-data'):
        os.makedirs('enviro-data')

    conf = Config(SETTINGS)
    conf.activateFan()
    
    #trys to send weather data to the server
    #handles errors when there is no server
    if SETTINGS["send_data"] and SETTINGS["server"]:
        data = read_data()
        json_data = json.dumps(data)
        endpoint = "wetterdaten"
        
        send_to_server(ip, port, endpoint, json_data, "wetter", "post")
            
            
    if SETTINGS["send_pi_settings"] and SETTINGS["server"]:
        settings = {
            "lcd_screen": SETTINGS["lcd_screen"],
            "fan_gpio": SETTINGS["fan_gpio"],
            "particulate_sensor": SETTINGS["particulate_sensor"],
        }
        json_settings = json.dumps(settings)
        endpoint = "settings"
        
        send_to_server(ip, port, endpoint, json_settings, "settings", "post")
    
    