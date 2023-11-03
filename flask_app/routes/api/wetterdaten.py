from flask import Blueprint, request
from server_settings import *
import db
import json

DB = db.Database("../wetter.db")
wetterdaten_route = Blueprint("wetterdaten_route", __name__)

@wetterdaten_route.route('/wetterdaten', methods=["POST"])
def wetterdaten():
    if request.method == "POST":
        #database
        data = json.loads(request.get_json())
        DB.addData("wetterdaten", data)
        """ DB.printTable("wetterdaten") """
        
        #handling response
        if SERVER_SETTINGS["logging"]:
            print("wetterdaten erhalten!")
        return { "message": "Added Entry" }
