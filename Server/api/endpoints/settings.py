# Provides routes to get and change settings of devices.
# User needs to be locked in as admin user to access 
from models.db import addEntry
from models.meta import get_meta_db
from flask import Blueprint, jsonify, request, session

settings_route = Blueprint("settings_route", __name__)

def time_to_second(time):
    if time == "sec": return 1
    elif time == "min": return 60
    elif time == "h": return 3600
    elif time == "d": return 24*3600


@settings_route.before_request
def settings_authenticator():
    if not session.get("is_admin"):
        return jsonify({"error": True, "text": "Forbidden"}), 403

@settings_route.post("/settings/<device_name>")
def settings_device(device_name):
    #data = json.loads(request.get_json())
    #print(device_name, request.form.keys())
    db = get_meta_db()
    cursor = db.cursor()
    body = request.get_json()
    device_id = ""
    print(request.get_json())
    
    #try:
    #    if int(body["GasStartUpTime"]) != int: raise TypeError()
    #    if int(body["Interval"]) != int: raise TypeError()
    #except SyntaxError: return jsonify({"error": True, "text": "Bad Request"}), 400
    #except TypeError: return jsonify({"error": True, "text": "Bad Request"}), 400
    #except Exception: return jsonify({"error": True, "text": "Internal Server Error"}), 500
    #return jsonify({"error": True, "text": "Internal Server Error"}), 500
    
    cursor.execute("INSERT OR IGNORE INTO device_lookup(device_name) VALUES(?)", (device_name,))
    device_id = cursor.execute(
        "SELECT id FROM device_lookup WHERE device_name=?",
        (device_name,)
    ).fetchone()["id"]
    print(device_id)
        
    try:
        settings = []
        for key in request.get_json().keys():
            settings.append([device_id, key,
                body[key]["value"],
                body[key]["extra"]
            ])

        cursor.executemany(
            """
            INSERT INTO device_settings(device_id, setting_name, setting_value, setting_extra)
            VALUES(?, ?, ?, ?) ON CONFLICT(device_id, setting_name) DO UPDATE SET
            setting_value=EXCLUDED.setting_value, setting_extra=EXCLUDED.setting_extra
            """,
            settings
        )
    except Exception as e:
        return jsonify({"error": True, "text": "Internal Server Error"}), 500
        
    db.commit()
    
    return jsonify({"error": False, "text": "OK"}), 200

@settings_route.get("/settings/<device_name>")
def get_device_settings(device_name):
    db = get_meta_db()
    cursor = db.cursor()
    try:
        device_id = cursor.execute(
            "SELECT id FROM device_lookup WHERE device_name=?",
            (device_name,)
        ).fetchone()["id"]
        
        settings = cursor.execute(
            """
            SELECT setting_name, setting_value FROM device_settings LEFT JOIN
            device_lookup ON device_settings.device_id = device_lookup.id
            WHERE device_settings.device_id=?;
            """,
            (device_id,)
        )
        
        return jsonify({"error": False, "text": "OK", "res": settings}), 200
    except Exception as e:
        #print(e)
        return jsonify({"error": True, "text": "Internal Server Error"}), 500