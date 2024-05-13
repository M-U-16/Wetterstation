import os
from models.db import addGases, addEntry
from flask_socketio import SocketIO, emit

socketio = SocketIO(cors_allowed_origins="*",logger=False)

# CLIENT NAMESPACE
@socketio.on("connect")
def connect_event(): print("Client connected!")

@socketio.on("disconnect")
def connect_event(): print("Client Disconnected!")

# PI NAMESPACE
@socketio.on("connect", namespace="/pi")
def readings_connect(auth):
    print(auth["key"])
    if auth["key"] != os.getenv("FLASK_PI_KEY"): return False
    print("Pi connected to server!")

@socketio.on("new-readings", namespace="/pi")
def send_new_readings(readings_data):
    addEntry(readings_data)
    emit("new-reading", readings_data, namespace="/", broadcast=True)
    
@socketio.on("new-gas", namespace="/pi")
def new_gas(gas_data):
    addGases(gas_data)
    emit("new-gas", gas_data, namespace="/", broadcast=True)
   
@socketio.on("disconnect", namespace="/pi")
def disconnect(): print("Pi Disconnected!")