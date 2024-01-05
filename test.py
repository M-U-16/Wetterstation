import socketio

# Establish a standard Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to the server.")
    sio.emit('message', 'Hello from the Python client!')

@sio.event
def response(data):
    print("Response from the server:", data)

# Connect to the Socket.IO server
sio.connect('http://localhost:8080')

# Keep the client running
try:
    sio.wait()
except KeyboardInterrupt:
    print("Disconnecting...")
    sio.disconnect()