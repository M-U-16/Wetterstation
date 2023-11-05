from flask import Blueprint, request
from server_settings import *
import db
import json

graph_route = Blueprint("graph_route", __name__)

@graph_route.route("/graph")
def graph():
    print(request.args["time"])
    return {"hello": "world"}