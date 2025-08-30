## Datei Struktur

Alle Quellcode -und Konfigurationsdateien, die gebraucht werden um die Wetterstation zu starten, sind in dem Ordner Wetterstation enthalten. Dieser enthält, unter anderem, die Ordner Server und Wettereinheit.
Jeder dieser Ordner enthält Code

## Installation

Damit der Server und das Program, welches die Wetterdaten an den Server sendet, funktionieren, müssen verschiedene Python-Bibliotheken installiert werden. Alle Bibliotheken werden in einer Virtuellen-Umgebung names venv gespeichert,
was bedeutet das alles in einem Unterordner von Wetterstation gespeichert wird und nicht in einem Systemordner. Mehr dazu [hier](https://docs.python.org/3/library/venv.html)

Um alle benötigten Bibliotheken zu installieren kann das Shell-Script setup.sh benutzt werden. Dafür muss man die Kommandozeile öffnen und auf das Verzeichnis Wetterstation wechseln. Wenn man nun sudo ./setup.sh ausführt, dann werden alle Bibliotheken installiert und die SQlite-Datenbank, in der die Wetterdaten gespeichert werden, mit den passenden Tabellen erstellt. 

Mehr Informationen zu dem Enviro+ Board findet man [hier](https://learn.pimoroni.com/article/getting-started-with-enviro-plus)
Dort wird nochmal erleutert, welche Bibliotheken das Board und die Sensoren brauchen, wie diese installiert werden und wie diese mit Python-Code benutzt werden können.

## Admin-Panel

Auf dem Pfad /admin im Webinterface können allgemeine Informationen abgerufen werden und
verschiedene Einstellungen gemacht werden. Das Passwort ist Standard mäßig 1234, kann aber über das Admin-Panel verändert werden. Falls nötig kann das Passwort auch in der .env Text-Datei im Wetterstations Ordner geändert werden.

## Log-Dateien
