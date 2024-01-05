from flask import request
from flask_socketio import SocketIO, emit
import dotenv
import os

dotenv.load_dotenv()
socketio = SocketIO(cors_allowed_origins="*", logger=False)

# CLIENT NAMESPACE

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

""" 
-------------
#############
-------------
"""

# READINGS NAMESPACE
    
@socketio.on("new-readings", namespace="/readings")
def send_new_readings(data):
    emit(
        "new-reading",
        data,
        namespace="/",
        broadcast=True
    )
    
@socketio.on("connect", namespace="/readings")
def readings_connect(auth):
    if auth["key"] != os.getenv("PI_KEY"): return False
    print("Pi connected to server!")
     
@socketio.on("disconnect", namespace="/readings")
def disconnect():
    print("Pi Disconnected!")