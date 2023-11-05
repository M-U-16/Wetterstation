from flask import Blueprint, request, current_app, g
from server_settings import *
import json
from database import Database

db = Database("../../wetter.db")

graph_route = Blueprint("graph_route", __name__)

@graph_route.route("/data")
def graph():
    if len(request.args) == 0:
        return {"error": True}
    try:
        if request.args["time"] == "1d": 
            return {
                "time": request.args["time"],
                "date": db.getDay()
            }
        if request.args["time"] == "1w":
            return {"data": request.args["time"]}
        if request.args["time"] == "1m":
            return {"data": request.args["time"]}
        if request.args["time"] == "1j":
            return {"data": request.args["time"]}
    except:
        return {"error": True}
    
    return {"error": True}