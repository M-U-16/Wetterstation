from models.db import addEntry
from models.meta import get_meta_db
from flask import Blueprint, jsonify, request, session

settings_route = Blueprint("settings_route", __name__)

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
    
    try:
        cursor.execute("INSERT OR IGNORE INTO device_lookup(device_name) VALUES(?)", (device_name,))
        db.commit()
    except Exception as e: pass
        #return jsonify({"error": True, "text": "Internal Server Error"}), 500

    return jsonify({"error": False, "text": "OK"}), 200

@settings_route.route('/settings/<device_name>/<setting>', methods=["POST"])
def settings_device_setting(device_name, setting):
    
    """ data = json.loads(request.get_json()) """
    """ addEntry(data) """
        
    #handling response
    print("wetterdaten erhalten!")
    return { "message": "Added Entry" }