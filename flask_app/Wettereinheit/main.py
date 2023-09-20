import requests
import json
import os

from settings import SETTINGS
from config import Config
from ReadData import read_data
from SendData import send_data

if __name__ == "__main__":
    #create directory for data entrys
    if not os.path.isdir('enviro-data'):
    os.makedirs('enviro-data')

    conf = Config(SETTINGS)
    conf.activateFan()

    ip = SETTINGS["ip_address"]
    port = SETTINGS["server_port"]
    data = json.dumps(read_data())

    send_data(ip, port, data)
    