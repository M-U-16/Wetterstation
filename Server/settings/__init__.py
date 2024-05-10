import os
from dotenv import find_dotenv, load_dotenv

def load_config(env: str):
    ENV_PATH = find_dotenv(env)
    os.environ["ENV_PATH"] = ENV_PATH
    load_dotenv(dotenv_path=ENV_PATH, override=True, verbose=True)