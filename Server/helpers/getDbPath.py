import os

def getPath():
    path = os.getcwd().split("\\")
    path.pop()
    path = "/".join(path)
