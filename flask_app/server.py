# -*- coding: utf-8 -*-
# Git repo <https://gitlab.com/idotj/enviroplusweb>
# Forked from <https://github.com/nophead/EnviroPlusWeb>
# EnviroPlusWeb is free software: you can redistribute it and/or modify it under the terms of the
# GNU General Public License as published by the Free Software Foundation, either version 3 of
# the License, or (at your option) any later version.
# EnviroPlusWeb is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
# without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
#
import math
import threading
from flask import Flask, render_template, url_for, request, session
import logging
import json
import os

import db
import setup_db
from server_settings import SERVER_SETTINGS

""" background_thread = threading.Thread(target = background) """
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True
run_flag = True

gas_sensor = None
particulate_sensor = None
fan_gpio = None

DB = db.Database("./wetter.db")

@app.route('/')
def index():
    
    return render_template("index.html",
        gas_sensor=gas_sensor,
        particulate_sensor=particulate_sensor,
        fan_gpio=fan_gpio
    )
   
@app.route('/wetterdaten', methods=["POST"])
def wetterdaten():
    if request.method == "POST":
        #database
        data = json.loads(request.get_json())
        DB.addData("wetterdaten", data)
        DB.printTable("wetterdaten")
        
        #handling response
        print("received data")
        return { "message": "Added Entry" }

@app.route("/settings", methods=["POST", "GET"])
def settings():
    args = request.args
    arg_keys = args.keys()
    
    #send
    if request.method == "GET":
        return session["pi_fan"]
        
    if request.method == "POST":
        if "fan" in arg_keys:
            fan_settings = request.args.get("fan")
            session["pi_fan"] = fan_settings
            
            return json.dumps({"message": "Received fan data!"})
    
@app.route('/graph')
def graph():
    """ arg = request.args["time"] """
    pass

if __name__ == '__main__':
    database_path = "/".join([SERVER_SETTINGS["db_path"], SERVER_SETTINGS["database"]])
    database_exists = os.path.isfile(database_path)
    
    #set up database if first start
    if not database_exists:
        setup_db.setUp("./wetter.db")
    ##############################
        
    #reset db for testing
    """ if SERVER_SETTINGS["reset_db"] and database_exists:
        setup_db.resetTable("./wetter.db") """
    
    app.run(debug = True, host = 'localhost', port = 80, use_reloader = False)
    run_flag = False
