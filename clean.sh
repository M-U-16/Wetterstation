if [[ -f "/etc/systemd/system/Wetterstation.service" ]]; then
    sudo rm /etc/systemd/system/Wetterstation.service
fi

if [[ -f "/etc/nginx/sites-available/Wetterstation" ]]; then
    sudo rm /etc/nginx/sites-available/Wetterstation
fi

if [[ -f "/etc/nginx/sites-enabled/Wetterstation" ]]; then
    sudo rm /etc/nginx/sites-enabled/Wetterstation
fi