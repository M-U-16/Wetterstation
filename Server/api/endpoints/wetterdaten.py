from flask import Blueprint, request
from models.db import addData
import json

wetterdaten_route = Blueprint("wetterdaten_route", __name__)

@wetterdaten_route.route('/wetterdaten', methods=["POST"])
def wetterdaten():
    
    #database
    data = json.loads(request.get_json())
    addData(data)
        
    #handling response
    print("wetterdaten erhalten!")
    return { "message": "Added Entry" }
    
