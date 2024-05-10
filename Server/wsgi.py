from app import create_app
# config import
from settings import load_config
load_config(".env.dev")
# -------------
app = create_app()