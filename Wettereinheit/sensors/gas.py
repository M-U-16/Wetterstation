import sys
import threading
import time
from threading import Thread
from datetime import datetime
from . import ExceptionWarmUpNotDone

try: from enviroplus import gas
except Exception as e:
    sys.exit(">> ERROR: {}".format(e))

# the gas sensor (MICS6814) needs around 10mins
# to warm up and stabilise its readings
# info from this article:
# https://learn.pimoroni.com/article/getting-started-with-enviro-plus
DEFAULT_STARTUP_TIME = 600

class GasSensor:
    def __init__(self,
        client, interval,
        start_up_time=DEFAULT_STARTUP_TIME
    ):
        self.name = "gas_sensor"
        self.interval = interval
        self.client = client
        
        # setup and start a new thread
        # to warm up the sensor
        self._start_up_time = start_up_time
        self._finished_start_up = threading.Event()
        self._start_up_thread = Thread(target=self._start_up)
        self._start_up_thread.start()
            
    def _start_up(self):
        start_time = time.time()
        while time.time() <= start_time + self._start_up_time:
            gas.read_all() # abandon data
            time.sleep(0.5) # slepp for short period
        self._finished_start_up.set()
    
    def read(self, date=False):
        # still 
        if not self._finished_start_up.is_set():
            raise ExceptionWarmUpNotDone("GasSensor still in warm up mode")
        
        gases = gas.read_all()
        readings = {
            "oxi": gases.oxidising / 1000,  #unit = "kO"
            "red": gases.reducing / 1000,   #unit = "kO"
            "nh3": gases.nh3 / 1000         #unit = "kO"
        }
        if date: readings["entry_date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return readings
        
""" class GasSensorThread(GasSensor, Thread):
    def __init__(self, client, interval, start_up_time=DEFAULT_STARTUP_TIME):
        GasSensor.__init__(
            self, client,
            interval, start_up_time
        )
        Thread.__init__(daemon=True)
    
    def run(self):
        self.start_up()
        while True:
            self.client.send_gas(data=self.read())
            time.sleep(self.interval) """