import socket
import sqlite3
import threading
from time import time

db = sqlite3.connect(":memory:")
db.row_factory = sqlite3.Row
cursor = db.cursor()
cursor.execute("CREATE TABLE keyvalue (key TEXT UNIQUE, value TEXT, ttl INTEGER)")

def CheckTtl():
    cursor.execute(
        "DELETE FROM keyvalue WHERE ttl < ?",
        [time()]
    )

def AddKey(key:str, value:str, ttl:int):
    CheckTtl()
    
    killTime = int(time()) + ttl
    cursor.execute(
        "INSERT INTO keyvalue(key, value, ttl) VALUES (?, ?, ?)",
        [key, value, killTime]
    )

def GetKey(key:str):
    CheckTtl()
    cursor.execute("select value from keyvalue where key=?", [key])
    

class Server(socket.socket):
    def __init__(self, address:tuple=("localhost", 8080)):
        super().__init__(socket.AF_INET, socket.SOCK_STREAM)
        self.bind(address)
        self.listen(10)
        self.msgend = "\r\n"
    
    def recvall(self, client) -> str:
        total_data = list()
        while True:
            data = client.recv(1024).decode()
            if self.msgend in data:
                total_data.append(data[:data.find(self.msgend)])
                break
            
            total_data.append(data)
            
            if len(total_data) > 1:
                last_end = total_data[-2] + total_data[-1]
                if self.end_marker in last_end:
                    total_data = total_data[:-2]
                    total_data.append(last_end[:last_end.find(self.msgend)])
                    break
    
    def handleClient(self, client):
        data = self.recvall(client)
        print(data)
        client.sendall(bytes(data.upper(), "utf-8"))
        client.close()
        
    def start(self):
        while True:
            client, address = self.accept()
            client_thread = threading.Thread(
                target=self.handleClient,
                args=(client,)
            )
            client_thread.start()    

class Client(socket.socket):
    def __init__(self):
        super().__init__(socket.AF_INET, socket.SOCK_STREAM)
    
    def connect_socket(self, address:tuple=("localhost", 8080)) -> None:
        self.connect(address)
        
    def message(self, data:str) -> str:
        self.sendall(bytes(data+"\r\n", "utf-8"))
        return self.recv(1024).decode()
    
def testClient():
    client = Client()
    client.connect_socket()
    return client.message("hello")

if __name__ == "__main__":
    """ server = socketserver.TCPServer(("localhost", 8080), TCPHandler, True)
    server.serve_forever() """
    server = Server()
    server.start()