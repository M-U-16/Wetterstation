import socketio

class SocketIoClient:
    def __init__(self, logger):
        self.io = socketio.Client(logger=logger, engineio_logger=logger)

    # method for sending new readings
    def send_readings(self, data):
        try:
            self.io.emit("new-readings", data, namespace="/pi")
        except Exception as e: print("ERROR: ", e)
    
    # method for sendign new gas data
    def send_gas(self, data):
        try:
            self.io.emit("new-gas", data, namespace="/pi")
        except Exception as e: print("ERROR: ", e)
    
def get_client(logger):
    client = SocketIoClient(logger)

    # event for getting messages
    @client.io.on("msg-server", namespace="/pi")
    def readings(msg): print("data: ", msg)

    # event for connecting to server
    @client.io.event(namespace="/pi")
    def connect(): print(">> Connected to server!")
    
    return client