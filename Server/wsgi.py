# config import
from settings import load_config
load_config(".env.dev")
# -------------
from app import create_app
app = create_app()