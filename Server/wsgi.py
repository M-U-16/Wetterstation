import os
import sys
from waitress import serve

# config import
from settings import load_config
load_config(os.getenv("ENV_FILE"))
# -------------
from app import create_app
app = create_app()

if os.getenv("WAITRESS_SERVER", False):
    serve(app, unix_socket="Wetterstation.sock")
else: sys.exit(1)


""" if platform.platform() == "linux" and os.getenv("WAITRESS_SERVER", False):
    serve(app, unix_socket="Wetterstation.sock")
else: sys.exit("Platform needs to be Linux and WAITRESS_SERVER=True!") """