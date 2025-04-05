import json
from models import get_db
from models.db import addEntry
from flask import Blueprint, jsonify, request

wetterdaten_route = Blueprint("wetterdaten_route", __name__)

@wetterdaten_route.get("/wetterdaten")
def get_wetterdaten():
    request.args.get("range")
    request.args.get("date")
    request.args.get("from")
    request.args.get("to")
    
    return jsonify({})

@wetterdaten_route.post('/wetterdaten')
def post_wetterdaten():
    _, cur = get_db()
    
    #database
    data = request.get_json()
    print(data)
    
    #addEntry(data)
        
    #handling response
    print("wetterdaten erhalten!")
    return jsonify({ "message": "ADDED_ENTRY" })
    
