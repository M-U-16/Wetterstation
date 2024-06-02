@ECHO OFF
if exist .env.dev (
    set ENV_FILE=.env.dev
    python run.py
) else (
    echo File '.env.dev' does not exist!
)
PAUSE