import os
import logging
from logging.handlers import TimedRotatingFileHandler

from config import test

#TimedRotatingFileHandler()
#logging.StreamHandler()
logger = logging.getLogger(__name__)

logging.basicConfig(
    handlers=[
        logging.FileHandler("test.log")
    ],
    encoding="utf-8",
    level=logging.ERROR,
    format="[%(asctime)s] %(filename)s:%(lineno)d | %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

test(logger)