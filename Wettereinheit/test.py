from time import *
import threading
from datetime import datetime
running = True

def test():
    thread_start = datetime.now().strftime("%H:%M:%S")
    while running:
        sleep(1000)
    thread_end = datetime.now().strftime("%H:%M:%S")
    
    print("Programm Start: " + thread_start)
    print("Programm Ende: " + thread_end)
    
if __name__ == "__main__":
    bg_thread = threading.Thread(target=test)
    bg_thread.start()

    print("---RUNNING NOW!!!---")
    while running:
        user_input = input("Type 'STOP' to stop the programm: ")
        if user_input == "STOP":
            running = False