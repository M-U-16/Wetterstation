import json
import os
from settings import SETTINGS
from config import Config
from helpers.SendData import send_to_server
from helpers.SaveData import save_data
from helpers.ReadFakeData import read_fake_data

if SETTINGS["server"]:
    ip = SETTINGS["ip_address"]
    port = SETTINGS["server_port"]

conf = Config(SETTINGS)
conf.activateFan()
    
def startMeasuring():
    #gets the fake data for testing
    data = read_fake_data()
    
    if SETTINGS["send_data"] and SETTINGS["server"]:
        json_data = json.dumps(data)
        res = send_to_server(
            SETTINGS["ip_address"], #ip of server
            SETTINGS["server_port"], #port where server is running
            "/api/wetterdaten", #endpoint
            json_data, #data for sending
            "wetter", #action for sending data
            "post" #string setting method
        )
        if SETTINGS["logging"]:
            print(res) #prints the response from server
            
    if SETTINGS["send_pi_settings"] and SETTINGS["server"]:
        settings = {
            "gas_sensor": SETTINGS["gas_sensor"],
            "fan_gpio": SETTINGS["fan_gpio"],
            "particulate_sensor": SETTINGS["particulate_sensor"],
        }
        json_settings = json.dumps(settings)
        endpoint = "/api/settings"
        res = send_to_server(ip, port, endpoint, json_settings, "settings", "post")
        if SETTINGS["logging"]:
            print(res)
            
    #-------------------------------------
    #here is the data being saved in files
    if SETTINGS["save_data"]:
        save_data(data)

if __name__ == "__main__":
    #create directory for data entrys if needed
    if not os.path.isdir('enviro-data'):
        os.makedirs('enviro-data')
        
    startMeasuring()
    
    