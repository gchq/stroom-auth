#!/usr/bin/env bash
#
# This script is the entrypoint of the container. First it refreshes the crontab,
# then it starts cron, and then it starts the service.

./create_crontab.sh &
cron &
java -jar stroom-auth-service-all.jar server config.yml