from flask import Blueprint, request
from models.db import getDay, getWeek, getMonth, getYear

graph_route = Blueprint("graph_route", __name__)

@graph_route.route("/data")
def graph():
    if len(request.args) == 0:
        return {"error": True}
    try:
        if request.args["time"] == "1d":
            return { "data": getDay() }
        if request.args["time"] == "1w":
            return {"data": getWeek() }
        if request.args["time"] == "1m":
            return {"data": getMonth() }
        if request.args["time"] == "1j":
            return {"data": getYear() }
    except Exception as e:
        print("Graph: ", e)
        return {"error": True}
    
    return {"error": True}