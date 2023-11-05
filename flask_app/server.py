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
import sqlite3
from flask import Flask, g, render_template, url_for, request, session
from livereload import Server
import logging
from server_settings import SERVER_SETTINGS

from db import *

#import routes
from routes.app.wetter import wetter_route
from routes.app.einstellungen import einstellungen_route

from routes.api_router import api_route

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'BAD_SECRET_KEY'
log = logging.getLogger("werkzeug")
log.disabled = True
run_flag = True

gas_sensor = None
particulate_sensor = None
fan_gpio = None

#load settings in conf
for config in SERVER_SETTINGS:
    app.config[config] = SERVER_SETTINGS[config]

#config for database
DATABASE = "./wetter.db"
def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
        
def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

#register app routes
app.register_blueprint(wetter_route)
app.register_blueprint(einstellungen_route)
#register api routes
app.register_blueprint(api_route)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    
    app.run(debug = True, host = 'localhost', port = 80, use_reloader = False)
    run_flag = False