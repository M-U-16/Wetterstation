# standard libraries
import sys, time, threading
# internal libraries
from config import config
from socketClient import get_client
from sensors.all import start_data_measuring
from sensors.gas import start_gas_measuring

# websocket client to send live data
server_client = get_client()
        
def main():
    gas_thread = threading.Thread(
        target=start_gas_measuring,
        daemon=True,
        args=(server_client, config["sensors.gas"]["StartUpTime"],)
    )
    data_thread = threading.Thread(
        target=start_data_measuring,
        daemon=True,
        args=(server_client,)
    )
    
    try:
        # connecting to server
        server_client.io.connect(
            "http://localhost:8080",
            namespaces="/pi",
            auth={"key": "1234"}
        )
        
        # start threads
        gas_thread.start()
        data_thread.start()
        
        # infinite loop for staying connected to server
        # via websocket connection
        # 
        while True: time.sleep(0.1)
            
    except KeyboardInterrupt:
        #server_client.io.disconnect() # disconnecting from server
        sys.exit(0)
    except Exception as e: sys.exit(">> ERROR: {}".format(e))

if __name__ == "__main__": main()