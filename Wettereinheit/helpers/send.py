import requests

def send_json(data, url):
    try: return requests.post(url,json=data).json()
    except Exception as e:
        print(">> ERROR: ", e)
        return {
            "error": True,
            "message":"ERROR_SENDING_REQUEST"
        } 
