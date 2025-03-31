from ltr559 import LTR559
from datetime import datetime

class Ltr559Sensor:
    def __init__(self):
        self.name = "ltr599_sensor"
        self.sensor = LTR559()
    
    def read(self, date=False):
        readings = {
            "proxi": round(self.sensor.get_proximity()),
            "lux": round(self.sensor.get_lux()), # unit = lux
        }
        
        if date:
            readings["date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        return readings
    
    def read_proximity(self): return self.read()["proxi"]
    def read_lux(self): return self.read()["lux"]