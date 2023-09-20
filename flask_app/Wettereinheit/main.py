from settings import SETTINGS
from config import Config
import requests
import json

conf = Config(SETTINGS)
conf.activateFan()

ip = SETTINGS["ip_address"]
port = SETTINGS["server_port"]
data = json.dumps(SETTINGS)

res = requests.post(f"http://{ip}:{port}/wetterdaten", json=data).json()
print(res["message"])