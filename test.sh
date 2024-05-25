NC='\033[0m' # No Color

BLACK="0;30"
Dark_Gray="1;30"
Red="0;31"
Light_Red="1;31"
Green="0;32"
Brown_Orange="0;33"
Yellow="1;33"
Blue="0;34"
Light_Blue="1;34"
Purple="0;35"
Light_Purple="1;35"
Cyan="0;36"
Light_Cyan="1;36"
Light_Gray="0;37"    
White="1;37"

LIGHT_GREEN="\033[1;32m"
PURPLE="\033[0;35m"
BLUE='\033[0;34m'

service_file_origin="setup-files/wetterstation.service"
service_file_destination="/etc/systemd/system/Wetterstation.service"

echo -e "${PURPLE}Copying service file for Wetterstation Server ${NC}"
echo -e "${BLUE}$service_file_origin ▶ $service_file_destination ${NC}"