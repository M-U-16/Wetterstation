# standard libraries
import os
import sys, time, threading
# internal libraries
from config import get_config
from socketClient import get_client
from sensors.all import start_data_measuring
from sensors.gas import start_gas_measuring

# specifies if random readings are
# used to send to server
isFake = os.getenv("WETTEREINHEIT_IS_FAKE", "False")
config = get_config("pi.ini")

# websocket client to send live data
client = get_client()
        
def main():
    gas_thread = threading.Thread(
        target=start_gas_measuring,
        daemon=True,
        args=(client, 60, 30,) #int(config["sensors.gas"]["StartUpTime"])
    )
    data_thread = threading.Thread(
        target=start_data_measuring,
        daemon=True,
        args=(client, 10,)
    )
    
    try:
        # connect to server
        if isFake == "True":
            client.io.connect(
                "http://localhost:8080",
                namespaces="/pi",
                auth={"key": config["server"]["key"]}
            )
        else:
            client.io.connect(
                config["server"]["url"],
                namespaces="/pi",
                auth={"key": config["server"]["key"]}
            )
        
        # start threads
        gas_thread.start()
        data_thread.start()
        
        client.io.wait()
        # infinite loop for staying connected to server
        # via websocket connection
        #while True: time.sleep(0.5)
            
    except KeyboardInterrupt:
        client.io.disconnect() # disconnecting from server
        sys.exit(0)
    except Exception as e:
        sys.exit(">> ERROR: {}".format(e))

if __name__ == "__main__": main()