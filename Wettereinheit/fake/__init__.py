import time
import random
from threading import Thread
from datetime import datetime

class GasSensorFake(Thread):
    def __init__(self, client, interval, start_up_time):
        self.start_up_time = start_up_time
        self.interval = interval
        self.client = client
    
    def _start_up(self):
        start_time = time.time()
        running = True
        while running:
            time.sleep(0.5)
            if time.time() > start_time + self.start_up_time:
                running = False
    
    def read(self):
        gases = {"oxidising": 10000, "reducing": 10000, "nh3": 10000}
        
        return {
            "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "oxi": gases.oxidising / 1000,  #unit = "kO"
            "red": gases.reducing / 1000,   #unit = "kO"
            "nh3": gases.nh3 / 1000         #unit = "kO"
        }
            
    def run(self):
        self._start_up()
        while True:
            self.client.send_gas(data=self.read())
            time.sleep(self.interval)

class Bme280SensorFake:
    def __init__(self, timeout):
        self.timeout = timeout
        self.running = False

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

class PMS5003Fake:
    def __init__(self): pass
    
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
    
class LightSensorFake:
    def __init__(self): pass
    def read(self, date=False):
        reading = random.randrange(1, 100)
        if date: reading["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return reading