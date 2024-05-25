from dataclasses import dataclass

@dataclass
class DateInfo:
    isComplete:bool = False
    isNone:bool     = True
    full:str|None   = None
    year:str|None   = None
    month:str|None  = None
    day:str|None    = None

@dataclass
class TimeInfo:
    isComplete:bool = False
    isNone:bool     = True
    full:str|None   = None
    hour:str|None   = None
    minute:str|None = None
    second:str|None = None

class DatetimeInfo:
    def __init__(self, date:str):
        self.raw_date:str = date
        self.date = DateInfo()
        self.time = TimeInfo()
        self.parse()
    
    def _parse_date(self, date:str) -> None:
        self.date.full = date
        split_date:list = date.split("-")
        
        if len(split_date) == 3:
            self.date.year = split_date[0]
            self.date.month = split_date[1]
            self.date.day = split_date[2]
            self.date.isComplete = True

        elif len(split_date) == 2:
            self.date.year = split_date[0]
            self.date.month = split_date[1]

        elif len(split_date) == 1:
            self.date.year = split_date[0]
            
        if len(split_date) != 0: self.date.isNone = False
            
    def _parse_time(self, time:str) -> None:
        self.time.full = time
        split_time:list = time.split(":")
                
        if len(split_time) == 3:
            self.time.hour = split_time[0]
            self.time.minute = split_time[1]
            self.time.second = split_time[2]
            self.time.isComplete = True
            
        elif len(split_time) == 2:
            self.time.hour = split_time[0]
            self.time.minute = split_time[1]

        elif len(split_time) == 1:
            self.date.year = split_time[0]
            
        if len(split_time) != 0: self.time.isNone = False
            
    def parse(self) -> None:
        split_datetime:list = self.raw_date.split("_")

        if len(split_datetime) == 2:
            self._parse_date(split_datetime[0])
            self._parse_time(split_datetime[1])
        elif len(split_datetime) == 1:
            self._parse_date(split_datetime[0])
            
    def __str__(self) -> str:
        date = ""
        if not self.date.isNone:
            date += self.date.full
        if not self.time.isNone:
            date += " "+self.time.full
        return date