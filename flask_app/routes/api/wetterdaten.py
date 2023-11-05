from flask import Blueprint, request
from server_settings import SERVER_SETTINGS
from database import Database
import json

DB = Database("C:/Users/Maurice/Documents/Projekte/Webseiten/WetterStation/Wetterstation-Projekt/Info-Projekt/flask_app/wetter.db")
wetterdaten_route = Blueprint("wetterdaten_route", __name__)

@wetterdaten_route.route('/wetterdaten', methods=["POST"])
def wetterdaten():
    
    #database
    data = json.loads(request.get_json())
    print(data)
    DB.addData(data)
        
    #handling response
    print("wetterdaten erhalten!")
    return { "message": "Added Entry" }
    
