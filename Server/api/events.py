from flask import request
from flask_socketio import SocketIO, emit
socketio = SocketIO(cors_allowed_origins="*", logger=False)

@socketio.on("connect")
def connect_event():
    print("Client connected!")

@socketio.on("disconnect")
def connect_event():
    print("Client Disconnected!")
    
@socketio.on("message")
def handle_message(data):
    print("message: ", data)
    return {"message": "got data"}
    
@socketio.event
def sendNewReadings(data):
    emit("new-readings", data, broadcast=True)
    
@socketio.on("connect", namespace="/readings")
def readings_connect(msg):
    print(msg)
    print("Pi connected to server!")
    return "hello"
     
@socketio.on("disconnect", namespace="/readings")
def disconnect():
    print("Pi Disconnected!")