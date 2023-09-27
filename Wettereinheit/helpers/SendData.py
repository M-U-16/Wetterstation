import requests

def send_to_server(ip, port, endpoint, data, action, method):
    #send a post request to the given ip and port
    #containing the data
    if action == "wetter":
        res = requests.post(f"http://{ip}:{port}/{endpoint}", json=data).json()
        print(res["message"])
    
    if action == "settings" and method == "post":
        res = requests.post(f"http://{ip}:{port}/{endpoint}", json=data).json()
        print(res["message"])
    
    if action == "settings" and method == "get":
        res = requests.get(f"http://{ip}:{port}/{endpoint}", json=data).json()
        print(res["fan"])
        
    