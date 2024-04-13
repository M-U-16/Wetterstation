import smbus2
import bme280
from datetime import datetime

class BME:
    def __init__(self, address, timeout):
        self.bus = smbus2.SMBus(1)
        self.address = address
        self.timeout = timeout
        self.running = False
        self.calibration = bme280.load_calibration_params(
            self.bus,
            self.address
        )

    # reads the current temperature, humidity and pressure
    def read_all(self, date=True):
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

    def read_temp(self): return self.read_all(date=False).temp
    def read_humi(self): return self.read_all(date=False).humi
    def read_temp(self): return self.read_all(date=False).pressure