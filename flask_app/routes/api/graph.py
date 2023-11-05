from flask import Blueprint, request
from server_settings import *
import json

graph_route = Blueprint("graph_route", __name__)

@graph_route.route("/data")
def graph():
    #print(request.args["time"])
    if request.args["time"] == "1d":
        return {"data": request.args["time"]}
    if request.args["time"] == "1w":
        return {"data": request.args["time"]}
    if request.args["time"] == "1m":
        return {"data": request.args["time"]}
    if request.args["time"] == "1j":
        return {"data": request.args["time"]}
    
    return {"error": True}