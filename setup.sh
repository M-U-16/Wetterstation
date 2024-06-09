#!/bin/bash

cat > environments/.env << EOF
FLASK_HOST=
FLASK_PORT=
FLASK_ENV=
FLASK_ADMIN_PASSWORD=
FLASK_PI_KEY=
FLASK_DEBUG=
FLASK_DEFAULT_MESSUNG_LIMIT=
FLASK_TEMPLATES_AUTO_RELOAD=
EOF

npm install     # use node package manager to install javascript librarys used to build static js files
npm run build   # build project using Rollup.js (runs command specified in package.json)

source venv/bin/activate 
pip install -r server.packages.txt # install all python packages using pip
pip install gunicorn
pip install eventlet
cd Server
python command.py create-default # create database files and tables