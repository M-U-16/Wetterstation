from socketIO_client import SocketIO

def ca(*args):
    print(args)

with SocketIO("localhost", 8080) as io:
    message = io.emit("message", {"hello": "world"}, ca)
    io.wait_for_callbacks(seconds=1)
    io.disconnect()
    