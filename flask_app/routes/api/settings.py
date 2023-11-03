import json
from flask import Blueprint, request, session

settings_route = Blueprint("settings_route", __name__)

@settings_route.route("/settings", methods=["POST", "GET"])
def settings():
    args = request.args
    arg_keys = args.keys()
    
    #send
    if request.method == "GET":
        return {"route": "settings"}
        return session["pi_fan"]
        
    if request.method == "POST":
        if "fan" in arg_keys:
            fan_settings = request.args.get("fan")
            session["pi_fan"] = fan_settings
            
            return json.dumps({"message": "Received fan data!"})
        else:
            session["pi_settings"] = json.dumps(request.get_json())
            pi_settings = json.loads(session["pi_settings"])
            """ print(pi_settings) """
            try:
                """ setSensors(
                    pi_settings["gas_sensor"],
                    pi_settings["particulate_sensor"],
                    pi_settings["fan_gpio"]
                ) """
                pass
            except:
                pass
            return json.dumps({ "message": "Set Pi Settings!" })
