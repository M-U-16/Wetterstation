import sys
import time
from datetime import datetime
try: from enviroplus import gas
except Exception as e: sys.exit(">> ERROR: {}".format(e))

def start_up_gas_sensor(startupTime:int):
    start_time = time.time()
    running = True
    while running:
        gas.read_all()
        time.sleep(0.5)
        
        if time.time() > start_time + startupTime:
            running = False
                
def read_gases(client, interval:int):
    while True:
        gases = gas.read_all()
        client.send_gas(
            data={
                "entry_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "oxi": gases.oxidising / 1000,  #unit = "kO"
                "red": gases.reducing / 1000,   #unit = "kO"
                "nh3": gases.nh3 / 1000         #unit = "kO"
            }
        )

        time.sleep(interval)

def start_gas_measuring(
    client,
    startupTime:int,
    interval:int
):
    start_up_gas_sensor(startupTime)
    read_gases(client, interval)