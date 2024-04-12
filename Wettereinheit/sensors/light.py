try:
    # Transitional fix for breaking change in LTR559
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559
    
class LightSensor:
    def __init__(self):
        self.unit = "lux"
    
    def get_lux(self):
        return ltr559.get_lux() 
    