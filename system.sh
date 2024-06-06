#!/bin/bash

# COLORS FOR COLORED TERMINAL OUTPUT
LIGHT_GREEN="\033[1;32m"
PURPLE="\033[0;35m"
BLUE='\033[0;34m'
NO_COLOR='\033[0m'

service_file_origin="system-files/wetterstation.service"
service_file_destination="/etc/systemd/system/Wetterstation.service"

# FEEDBACK
echo -e "${PURPLE}Copying service file for Wetterstation Server${NO_COLOR}"
echo -e "${BLUE}$service_file_origin ▶ $service_file_destination${NO_COLOR}"
sudo cp $service_file_origin $service_file_destination
echo ""
# ---

sudo systemctl daemon-reload
sudo systemctl start Wetterstation # start daemon
#sudo systemctl enable Wetterstation # start on boot
sudo systemctl status Wetterstation

nginx_config_origin="system-files/wetterstation.nginx.conf"
nginx_config_sites_available="/etc/nginx/sites-available/Wetterstation"
nginx_config_sites_enabled="/etc/nginx/sites-enabled/Wetterstation"

# FEEDBACK
echo -e "${PURPLE}Copying Nginx config file for Wetterstation Server${NO_COLOR}"
echo -e "${BLUE}$nginx_config_origin ▶ $nginx_config_sites_available${NO_COLOR}"
echo ""
# ---
sudo cp $nginx_config_origin $nginx_config_sites_available
sudo ln -s $nginx_config_sites_available $nginx_config_sites_enabled

echo "Testing Nginx Config"
sudo nginx -t
sudo systemctl restart nginx