#!/bin/sh

# CONFIGURE SHELL COLOURS (must be used with 'echo -e')
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color



# TEST PARAMS 
mode=$1
if [ -z "$mode" ]
then
    echo -e "${RED}Error${NC}: Please specify ${GREEN}dev${NC} or ${GREEN}prod{$NC} as a parameter."
    exit 1
elif [ "$mode" != "prod" ] && [ "$mode" != "dev" ]
then
    echo -e "${RED}Error${NC}: Please specify ${GREEN}dev${NC} or ${GREEN}prod${NC} as a parameter."
    exit 1
fi
echo -e "Creating a ${GREEN}$mode${NC} config."



# GET IP ADDRESS
if [ "$(uname)" == "Darwin" ]; then
    # Code required to find IP address is different in MacOS
    ip=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}')
else
    ip=$(ip route get 1 |awk 'match($0,"src [0-9\\.]+") {print substr($0,RSTART+4,RLENGTH-4)}')
fi
echo -e "Using IP ${GREEN}${ip}${NC} as the IP, as determined from the operating system."



# CREATE THE CONFIG
outputFile="public/auth/config.json"
sed "s/IP_ADDRESS/$ip/g" config.template.json > $outputFile

if [ "$mode" = "prod" ]
then
    sed -i "s/ADVERTISED_URL/$ip/g" $outputFile
elif [ "$mode" = "dev" ]
then
    sed -i "s/ADVERTISED_URL/$ip:5000/g" $outputFile
fi



echo -e "The new config looks like this:"
cat $outputFile