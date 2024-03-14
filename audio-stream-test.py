import sounddevice as sd
from flask import Flask, Response, render_template

options = {
    "rate": 44100,
    "chunk": 1024,
    "channels": 2,
    "bps": 16,
    "device": 1
}
            
app = Flask(__name__, template_folder="temps")

def genHeader(sampleRate, bitsPerSample, channels):
    datasize = 2000*10**6
    o = bytes("RIFF",'ascii')                                               
    o += (datasize + 36).to_bytes(4,'little')
    o += bytes("WAVE",'ascii')
    o += bytes("fmt ",'ascii')
    o += (16).to_bytes(4,'little')
    o += (1).to_bytes(2,'little')
    o += (channels).to_bytes(2,'little')
    o += (sampleRate).to_bytes(4,'little')
    o += (sampleRate * channels * bitsPerSample // 8).to_bytes(4,'little')
    o += (channels * bitsPerSample // 8).to_bytes(2,'little')
    o += (bitsPerSample).to_bytes(2,'little')
    o += bytes("data",'ascii')
    o += (datasize).to_bytes(4,'little')
    return o

@app.route("/audio")
def audio():
    def read(stream):
        return b"".join([item for item in stream.read(options["chunk"])[0]])
    
    def sound():
        stream = sd.RawInputStream(
            samplerate=options["rate"],
            blocksize=options["chunk"],
            dtype="int16",
            device=options["device"],
            channels=options["channels"]
        )
        stream.start()

        wav_header = genHeader(options["rate"], options["bps"], options["channels"])
        yield(wav_header + read(stream))
        while True:
            data = read(stream)
            yield(data)

    res = Response(sound())

    return res

@app.get("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run("localhost", port=8080, debug=True)