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
from flask import Flask, render_template, url_for, request
import logging
import json
import os

import db
import setup_db
from server_settings import SERVER_SETTINGS


def read_day(fname):
    day = []
    print("reading " + fname)
    with open(fname, 'r') as f:
        for line in f.readlines():
            record = json.loads(line)
            add_record(day, record)
    return day

def compress_data(ndays, nsamples):
    cdata = []
    for day in days[-(ndays + 1):]:
        for i in range(0, len(day), nsamples):
            cdata.append(sum_data(day[i : i + nsamples]))
    length = ndays * samples_per_day // nsamples
    return json.dumps(cdata[-length:])
# 288 @ 5m = 24h
# 336 @ 30m = 1w
# 372 @ 2h = 31d
# 365 @ 1d = 1y

""" background_thread = threading.Thread(target = background) """
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
log = logging.getLogger("werkzeug")
log.disabled = True
run_flag = True

@app.route('/')
def index():
    """ 
    return render_template("index.html"
    gas_sensor=gas_sensor,
    particulate_sensor=particulate_sensor,
    fan_gpio=fan_gpio)
    """
    return render_template('index.html')

@app.route('/wetterdaten', methods=["POST"])
def wetterdaten():
    if request.method == "POST":
        #database
        data = json.loads(request.get_json())
        db.addData(data)
        db.printTable()
        
        #handling response
        print("received data")
        return { "message": "Added Entry" }
    
@app.route('/readings')
def readings():
    if fan_gpio:
        arg = request.args["fan"]
        pwm.ChangeDutyCycle(int(arg))
    return record

@app.route('/graph')
def graph():
    arg = request.args["time"]
    if arg == 'day':
        last2 = []
        for day in days[-2:]:
            last2 += day
        return json.dumps(last2[-samples_per_day:])
    if arg == 'week':
        return compress_data(7, 30 * 60 // samples)
    if arg == 'month':
        return compress_data(31, 120 * 60 // samples)
    if arg == 'year':
        return compress_data(365, samples_per_day)
    return json.dumps(data)

if __name__ == '__main__':
    #set up database if first start
    database_path = "/".join([SERVER_SETTINGS["db_path"], SERVER_SETTINGS["database"]])
    if not os.path.isfile(database_path):
        setup_db.setUp("./wetter.db")
    ##############################
    
    app.run(debug = True, host = 'localhost', port = 80, use_reloader = False)
    run_flag = False
