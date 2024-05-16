# standard libraries
import sys, time, threading
# internal libraries
from config import get_config
from socketClient import get_client
from helpers.fakeSensor import start_fake_gas_measuring
from helpers.fakeSensor import start_fake_data_measuring

config = get_config("pi.ini")

# websocket client to send live data
server_client = get_client()

def main():
    gas_thread = threading.Thread(
        target=start_fake_gas_measuring,
        daemon=True,
        args=(server_client, 10,)
    )
    data_thread = threading.Thread(
        target=start_fake_data_measuring,
        daemon=True,
        args=(server_client,)
    )
    
    try:
        # connecting to server
        server_client.io.connect(
            "http://localhost:8080",
            namespaces="/pi",
            auth={"key": config["server"]["key"]}
        )
        
        # start threads
        gas_thread.start()
        data_thread.start()
        
        # infinite loop for staying connected to server
        # via websocket connection
        while True: time.sleep(0.01)
            
    except KeyboardInterrupt:
        server_client.io.disconnect() # disconnecting from server
        sys.exit(0)
    except Exception as e: sys.exit(">> ERROR: {}".format(e))

if __name__ == "__main__": main()