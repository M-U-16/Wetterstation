from flask_socketio import SocketIO, emit
socketio = SocketIO(cors_allowed_origins="*", logger=True)

@socketio.on("connect")
def connect_event():
    print("Client connected")
    
@socketio.on("message")
def handle_message(data):
    print("message: ", data)
    
@socketio.event
def sendNewReadings(data):
    emit("new-readings", data, broadcast=True)