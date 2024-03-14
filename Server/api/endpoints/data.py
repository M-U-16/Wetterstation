from flask import Blueprint, request, jsonify
from models.db import getDay, getWeek, getMonth, getYear

data_route = Blueprint("graph_route", __name__)

@data_route.route("/data", methods=["GET"])
def graph():
    if len(request.args) == 0:
        return {"error": True, "message": "NO_TIME_PARAMETER"}
    try:
        if request.args["time"] == "1d":
            return jsonify({ "data": getDay() })
        if request.args["time"] == "1w":
            return jsonify({"data": getWeek() })
        if request.args["time"] == "1m":
            return jsonify({"data": getMonth() })
        if request.args["time"] == "1y":
            return jsonify({"data": getYear() })
    except Exception as e:
        return jsonify({"error": True})
    
    return jsonify({"error": True, "message": "COULD_NOT_GET_DATA"})