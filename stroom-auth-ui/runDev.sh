#!/bin/bash

# Code required to find IP address is different in MacOS
if [ "$(uname)" == "Darwin" ]; then
  ip=`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`
else
  ip=`ip route get 1 | awk '{print $NF;exit}'`
fi

echo -e "Using the following IP as the advertised host: ${GREEN}$ip${NC}"

echo -e "Creating .env.development..."
cat .env.template | sed "s/<ADVERTISED_HOST>/$ip/g" > .env.development

yarn start