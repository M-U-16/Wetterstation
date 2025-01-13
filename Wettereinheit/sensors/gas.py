import sys
import time
from threading import Thread
from datetime import datetime

try:
    from enviroplus import gas
except Exception as e:
    sys.exit(">> ERROR: {}".format(e))

# the gas sensor (MICS6814) needs around 10min
# to warm up and stabilise its readings
# info from this article:
# https://learn.pimoroni.com/article/getting-started-with-enviro-plus
DEFAULT_STARTUP_TIME = 600

class GasSensor(Thread):
    def __init__(self, client, interval, start_up_time):
        self.start_up_time = start_up_time
        self.interval = interval
        self.client = client
    
    def _start_up(self):
        start_time = time.time()
        running = True
        while running:
            gas.read_all() # abandon data
            time.sleep(0.5) # slepp for short period
            
            # check if the time for startup of sensor if over
            if time.time() > start_time + self.start_up_time:
                running = False
    
    def read(self):
        gases = gas.read_all()
        
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