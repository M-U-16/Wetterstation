from flask import Blueprint, request, jsonify
from models.db import getDate, getDay, getLastByAmount, getWeek, getMonth, getYear

data_route = Blueprint("graph_route", __name__, url_prefix="/data")

@data_route.get("/")
def graph():
    if len(request.args) == 0:
        return jsonify({"error": True, "message": "NO_PARAMETERS"})
    
    try:
        if request.args.get("range") == "1d":
            return jsonify({ "data": getDay() })
        if request.args.get("range") == "1w":
            return jsonify({"data": getWeek() })
        if request.args.get("range") == "1m":
            return jsonify({"data": getMonth() })
        if request.args.get("range") == "1y":
            return jsonify({"data": getYear() })
    
        if request.args.get("date"):
            print(request.args.get("date"))
            #print("data: ", getDate(request.args["date"]))
            return jsonify({"data": getDate(request.args["date"])})
        
        if request.args.get("year"):
            return jsonify({"data": getYear(request.args.get("year"))})
            pass
        
    except Exception: return jsonify({"error": True})

    return jsonify({
        "error": True,
        "message": "COULD_NOT_GET_DATA"
    })
    
@data_route.post("/gas")
def post_gas():
    try:
        print(request.get_data())
        print(request.json)
        return jsonify({"error": False}), 200
    except: return jsonify({"error": True}), 400
    
@data_route.post("/readings")
def post_readings():
    try:
        print(request.get_data())
        print(request.json)
        return jsonify({"error": False}), 200
    except: return jsonify({"error": True, "message": ""}), 400