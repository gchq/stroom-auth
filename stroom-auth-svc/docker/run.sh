#!/usr/bin/env bash
#
# This script is the entrypoint of the container. First it refreshes the crontab,
# then it starts cron, and then it starts the service.

# Build the crontab file to send logs to stroom
./create_crontab.sh &

# Start the cron daemon
cron &

# Start the app
java -jar stroom-auth-service-all.jar server config.yml
