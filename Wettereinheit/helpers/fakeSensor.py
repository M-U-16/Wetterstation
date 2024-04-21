import time
import random
from datetime import datetime

def fake_start_up_gas_sensor(startupTime):
    
    start_time = time.time()
    running = True
    while running:
        time.sleep(0.5)
        if time.time() > start_time + startupTime:
            running = False
    print(">> gas startup finished")
    
def read_fake_gases(client):
    while True:
        gases = {"oxidising": 10000, "reducing": 10000, "nh3": 10000}
        client.send_gas(
            data={
                "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "oxi": gases["oxidising"] / 1000,  #unit = "kO"
                "red": gases["reducing"] / 1000,   #unit = "kO"
                "nh3": gases["nh3"] / 1000         #unit = "kO"
            }
        )
        time.sleep(30)

def start_fake_gas_measuring(client, startupTime):
    fake_start_up_gas_sensor(startupTime)
    read_fake_gases(client)

def start_fake_data_measuring(client):
    while True:
        client.send_readings(
            data={
                "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "temp": random.randrange(0,34),
                "humi": random.randrange(0,100),
                "pres": random.randrange(1, 1000),
                "lux": random.randrange(1, 100),
                "pm10": random.randrange(10, 20),
                "pm25": random.randrange(21, 25),
                "pm100": random.randrange(100, 1000),
            }
        )
        time.sleep(5)