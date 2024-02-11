import os
import dotenv
from helpers.fakeEntrys import getManyRandomDataEntrys

dotenv_file = dotenv.find_dotenv(os.getenv("env-name"))
dotenv.load_dotenv(dotenv_file)

DATABASE_PATH = os.getenv("DATABASE_PATH")

