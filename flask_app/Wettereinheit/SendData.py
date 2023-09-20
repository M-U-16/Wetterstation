import requests

def send_data(ip, port, data):
    #send a post request to the given ip and port
    #containing the data
    res = requests.post(f"http://{ip}:{port}/wetterdaten", json=data).json()
    print(res["message"])