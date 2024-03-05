import os
import time
import smbus2
import bme280

class BME:
    def __init__(self, address, timeout):
        self.bus = smbus2.SMBus(1)
        self.address = address
        self.timeout = timeout
        self.calibration = bme280.load_calibration_params(
            self.bus,
            self.address
        )
        
    def read(self):
        data = bme280.sample(self.bus, self.calibration)
        print(data)
        
    def run(self, queue):
        pass