from flask import Blueprint, request, current_app, g
from server_settings import *
import os
import json
from helpers.getDbPath import getPath
from db import getDay, getWeek, formatResponse

graph_route = Blueprint("graph_route", __name__)

path = os.getcwd().split("\\")
path.pop()
path = "/".join(path)

#db = Database(path + "/flask_app/wetter.db")

@graph_route.route("/data")
def graph():
    if len(request.args) == 0:
        return {"error": True}
    try:
        if request.args["time"] == "1d":
            return { "data": formatResponse(getDay()) }
        if request.args["time"] == "1w":
            getWeek()
            return {"data": request.args["time"]}
        if request.args["time"] == "1m":
            return {"data": request.args["time"]}
        if request.args["time"] == "1j":
            return {"data": request.args["time"]}
    except Exception as e:
        print("Graph: ", e)
        return {"error": True}
    
    return {"error": True}