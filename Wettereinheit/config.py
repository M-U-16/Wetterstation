import configparser
from configparser import ExtendedInterpolation
config = configparser.ConfigParser(interpolation=ExtendedInterpolation())
config.optionxform=str
config.read("pi.ini")