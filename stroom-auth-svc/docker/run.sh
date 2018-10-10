#!/usr/bin/env bash

./create_crontab.sh &
cron &
java -jar stroom-auth-service-all.jar server config.yml