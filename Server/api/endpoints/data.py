from flask import Blueprint, request, jsonify
from models.db import getDay, getLastByAmount, getWeek, getMonth, getYear

data_route = Blueprint("graph_route", __name__, url_prefix="/data")

@data_route.get("/")
def graph():
    if len(request.args) == 0:
        return {"error": True, "message": "NO_PARAMETERS"}
    try:
        if request.args["time"] == "1d":
            return jsonify({ "data": getDay() })
        if request.args["time"] == "1w":
            return jsonify({"data": getWeek() })
        if request.args["time"] == "1m":
            return jsonify({"data": getMonth() })
        if request.args["time"] == "1y":
            return jsonify({"data": getYear() })
        
    except Exception:
        if request.args["entrys"]:
            entrys = getLastByAmount(request.args["entrys"])
            return jsonify({ "data": entrys })
    except: return jsonify({"error": True})
    
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