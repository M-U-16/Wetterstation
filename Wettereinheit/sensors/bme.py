import smbus2
import bme280
from datetime import datetime

class Bme280Sensor:
    def __init__(self, address, interval=None):
        self.name = "bme280"
        self.address = address
        self.interval = interval
        self.bus = smbus2.SMBus(1)
        self.calibration = bme280.load_calibration_params(
            self.bus,
            self.address
        )

    # reads the current temperature, humidity and pressure
    def read(self, date=False):
        sample = bme280.sample(
            self.bus,
            self.address,
            self.calibration
        )
        data = {
            "temp": sample.temperature,
            "humi": sample.humidity,
            "pressure": sample.pressure
        }
        if date: data["date"] = datetime.now()
        return data

    def read_temp(self): return self.read()["temp"]
    def read_humi(self): return self.read()["humi"]
    def read_temp(self): return self.read()["pressure"]