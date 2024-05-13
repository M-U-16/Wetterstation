"""
    EXPIRMENTAL TESTING FOR SOUND RECORDING
"""

import sys
import time
import argparse
import soundfile as sf
import sounddevice as sd
from multiprocessing import Queue, Process, Pipe

parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("-lsd", "--list-devices", action="store_true")
args = parser.parse_args()
if args.list_devices:
    print(sd.query_devices())
    sys.exit(0)

def Record(options, pipe):
    queue = Queue()
    
    def callback(data, frames, time, status):
        queue.put(data.copy())

    soundfile = sf.SoundFile(
        options["filename"], mode="w",
        samplerate=options["samplerate"],
        channels=options["channels"],
        subtype=options["subtype"]
    )
    stream = sd.InputStream(
        callback=callback,
        channels=options["channels"],
        device=options["device"]
    )
    
    end = round(time.time() + options["duration"])
    print(end, file=sys.stdout)
    with soundfile as file:
        with stream:
            while time.time() < end:
                file.write(queue.get())

options = {
    "filename": "test.wav",
    "samplerate": 44100,
    "subtype": "PCM_16",
    "channels": 2,
    "device": 1,
    "duration": 5
}

recordProcPipe, recordMainPipe = Pipe(duplex=True)
recordProc = Process(target=Record, args=(options, recordProcPipe,))