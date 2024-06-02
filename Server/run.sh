if [[ -f ".env.dev" ]]; then
    ENV_FILE=".env.dev" python run.py
    exit
else
    echo "No '.env.dev' file in Server folder!"
fi