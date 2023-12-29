import requests #module for sending data

def send_to_server(ip, port, endpoint, data, action, method):
    #send a post request to the given ip and port
    #containing the data
    #handles errors when there is no server
    try:
        if action == "wetter":
            res = requests.post(f"http://{ip}:{port}/{endpoint}", json=data).json()
            return res["message"]
    
        if action == "settings" and method == "post":
            res = requests.post(f"http://{ip}:{port}/{endpoint}", json=data).json()
            return res["message"]
    
        if action == "settings" and method == "get":
            res = requests.get(f"http://{ip}:{port}/{endpoint}", json=data).json()
            return res["fan"]
    except Exception as e:
        print("Can't connect to server!")
        print("Error. ", e)