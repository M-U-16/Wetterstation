import time
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

    # reads the current temperature, humidity and
    # pressure and if set to true(default) also adds current date
    # -----------------------------------------------------------
    def read(self, date=True):
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

    # handler for messages from pipe
    # in start method
    # -> expects message from main process
    # ------------------------------------
    def handleMsg(self, msg):
        if msg == "stop-running":
            self.running = False

    # continuously reads bme sensor data
    # and puts it on a queue for the main process
    # -> should be started in external process
    # -------------------------------------------
    def start(self, msgPipe, dataQueue):
        self.running = True

        while self.running:
            #check if process should end
            if msgPipe.poll():
                self.handleMsg(msgPipe.recv())

            data = self.read(True)
            dataQueue.put(data)
            time.sleep(self.timeout)
        msgPipe.send("process-stopped")