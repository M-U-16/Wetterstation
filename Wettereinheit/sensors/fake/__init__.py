import time
import random
from threading import Thread
from datetime import datetime

TEST_START_UP_TIME = 60

class GasSensorFake:
    def __init__(
        self, client,
        interval=None, start_up_time=TEST_START_UP_TIME
    ):
        self.name = "gas_sensor_fake"
        self.start_up_time = start_up_time
        self.interval = interval
        self.client = client
    
    def start_up(self):
        start_time = time.time()
        running = True
        while running:
            time.sleep(0.5)
            if time.time() > start_time + self.start_up_time:
                running = False
    
    def read(self, date=False):
        gases = {"oxidising": 10000, "reducing": 10000, "nh3": 10000}
        readings = {
            "oxi": gases.oxidising / 1000,  #unit = "kO"
            "red": gases.reducing / 1000,   #unit = "kO"
            "nh3": gases.nh3 / 1000         #unit = "kO"
        }
        if date: readings["entry_date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return readings
            

class GasSensorThreadFake(Thread, GasSensorFake):
    def __init__(self, client, interval, start_up_time=TEST_START_UP_TIME):
        super(client, interval, start_up_time)
    
    def run(self):
        self.start_up()
        while True:
            self.client.send_gas(data=self.read())
            time.sleep(self.interval)
    

class Bme280SensorFake:
    def __init__(self):
        self.name = "bme280_fake"

    # reads the current temperature, humidity and pressure
    def read(self, date=False):
        data = {
            "temp": random.randrange(0,34),
            "humi": random.randrange(0,100),
            "pres": random.randrange(1, 1000)
        }
        if date: data["date"] = datetime.now()
        return data

    def read_temp(self): return self.read(date=False)["temp"]
    def read_humi(self): return self.read(date=False)["humi"]
    def read_pres(self): return self.read(date=False)["pres"]

class ParticleSensorFake:
    def __init__(self):
        self.name = "pms5003_fake"
    
    def read(self, date=False):
        readings = {
            "pm10": random.randrange(10, 20),
            "pm25": random.randrange(21, 25),
            "pm100": random.randrange(100, 1000),
        }
        if date: readings["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return readings
        
    def read_pm10(self): return self.read(date=False)["pm10"]
    def read_pm25(self): return self.read(date=False)["pm25"]
    def read_pm100(self): return self.read(date=False)["pm100"]
    
class Ltr559SensorFake:
    def __init__(self):
        self.name = "ltr_sensor_fake"
    def read(self, date=False):
        reading = random.randrange(1, 100)
        if date: reading["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return reading