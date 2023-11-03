""" from flask import Blueprint
routes = Blueprint("routes", __name__)

from .settings import *
from .wetter import *
from .wetterdaten import * """