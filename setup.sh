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
pip install -r wettereinheit.packages.txt
cd Server
python command.py create-default # create database files and tables

# COLORS FOR COLORED TERMINAL OUTPUT
LIGHT_GREEN="\033[1;32m"
PURPLE="\033[0;35m"
BLUE='\033[0;34m'
NO_COLOR='\033[0m'

service_file_origin="system-files/wetterstation.service"
service_file_destination="/etc/systemd/system/Wetterstation.service"

#cho -e "${PURPLE}Copying service file for Wetterstation Server${NO_COLOR}"
echo -e "${BLUE}$service_file_origin ▶ $service_file_destination${NO_COLOR}"
sudo cp $service_file_origin $service_file_destination
echo ""
# --- FEEDBACK
e

sudo systemctl daemon-reload
sudo systemctl start Wetterstation # start daemon
#sudo systemctl enable Wetterstation # start on boot
sudo systemctl status Wetterstation

nginx_config_origin="system-files/wetterstation.nginx.conf"
nginx_config_sites_available="/etc/nginx/sites-available/Wetterstation"
nginx_config_sites_enabled="/etc/nginx/sites-enabled/Wetterstation"

# FEEDBACK
echo -e "Copying Nginx config file for Wetterstation Server"
echo -e "$nginx_config_origin ▶ $nginx_config_sites_available"
echo ""
# ---

sudo cp $nginx_config_origin $nginx_config_sites_available
sudo ln -s $nginx_config_sites_available $nginx_config_sites_enabled

echo "Testing Nginx Config"
sudo nginx -t
sudo systemctl restart nginx