""" LOAD THE CONFIG FILE FOR Wettereinheit """

import configparser
from configparser import ExtendedInterpolation

def get_config(path):
    config = configparser.ConfigParser(interpolation=ExtendedInterpolation())
    config.optionxform=str
    config.read(path)
    
    return config