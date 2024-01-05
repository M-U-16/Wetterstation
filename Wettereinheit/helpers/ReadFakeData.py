from time import sleep, time, asctime, localtime, strftime, gmtime
import random
from datetime import datetime

def read_fake_data():
    
    return {
        "entry_date": datetime.now().strftime('%d.%m.%Y %H:%M:%S'),
        "temp": random.randrange(0,34),
        "humi": random.randrange(0,100),
        "pres": random.randrange(1, 1000),
        "lux": random.randrange(1, 100),
        "high": None,
        "mid": None,
        "low": None,
        "amp": None,
        "oxi": None,
        "red": None,
        "nh3": None,
        "pm10": None,
        "pm25": None,
        "pm100": None,
    }