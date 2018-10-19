#!/usr/bin/env bash

# Build the crontab file to send logs to stroom
./create_crontab.sh &

# Start the cron daemon
cron &

# Start the app
java -jar stroom-auth-service-all.jar server config.yml
