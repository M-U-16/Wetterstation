from settings import SETTINGS
from config import Config

conf = Config()
conf.activateFan(SETTINGS["fan_gpio"])

def printSettings():
    print(SETTINGS)
    
printSettings()