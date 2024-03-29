from flask import Blueprint, request
from models.db import getLastEntrys

entry_route = Blueprint("entry_route", __name__)

def getEntryResponse(entrys):
    return {
        "data": entrys[0],
        "last_id": entrys[1]
    }    

@entry_route.route("/entrys")
def get_entrys():
    if len(request.args) == 0:
        entrys = getLastEntrys()
        return getEntryResponse(entrys)
    try:
        entrys = getLastEntrys(request.args["last"])
        return getEntryResponse(entrys)
        
    except:
        return {"error": "NO_VALID_ARGUMENT"}