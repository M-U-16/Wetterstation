import sys
import time
import socketio
from helpers.ReadFakeData import read_fake_data

LOGGER = False
# creating socketio instance
io = socketio.Client(logger=LOGGER, engineio_logger=LOGGER)

def send_readings(data):
    io.emit("new-readings", data, namespace="/readings")

# event for getting messages
@io.on("msg-server", namespace="/readings")
def readings(msg):
    print("data: ", msg)

@io.event(namespace="/readings")
def connect():
    print(">> Connected to server!")

def main():
    print("--- CTRL + C TO EXIT ---")
    try:
        # connecting to server
        io.connect(
            "http://localhost:8080",
            namespaces="/readings",
            auth={"key": "fid222d9349dfkjfkdjf34dfdd2?!"}
        )
        # infinite loop for staying connected to server
        # > workaround < io.wait() not possible
        # to ctrl + c 
        while True:
            data = read_fake_data()
            print(data)
            send_readings(data)
            
            time.sleep(5)
            
    # exception handler for ctrl+c
    # to cleanly exit script
    except KeyboardInterrupt:
        io.disconnect() # disconnecting from server
        print("- ctrl + c -")
        print(">> Disconnected from server!")
        sys.exit("--- PROGRAMM STOPPED ---") # programm exit
        
if __name__ == "__main__":
    main()