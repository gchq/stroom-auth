#!/usr/bin/env bash
#
# Creates the crontab for sending log files to Stroom.

# Construct the send command
readonly SEND_SCRIPT="/usr/stroom-auth-service/send_to_stroom.sh"
readonly LOG_DIR="/usr/stroom-auth-service/logs/events"
readonly SEND_COMMAND="${SEND_SCRIPT} ${LOG_DIR} ${SEND_LOGS_FEED_NAME} ${SEND_LOGS_SYSTEM} ${SEND_LOGS_ENV} ${SEND_LOGS_STROOM_URL} -m ${SEND_LOGS_MAX_SLEEP} --no_pretty --delete_after_sending --secure"
echo "send_to_stroom.sh command will be ${SEND_COMMAND}"

# Construct the crontab line
readonly PIPE=">> /usr/stroom-auth-service/logs/cron.log 2>&1"
readonly CRONTAB="${SEND_LOGS_CRONTAB} ${SEND_COMMAND} ${PIPE}"
echo "crontab for sending logs will be ${CRONTAB}"

# Create the crontab file -- always over-write so we have the latest from the env vars
readonly CRONTAB_FILE="/etc/cron.d/send-logs-cron"
mkdir -p /etc/cron.d
touch ${CRONTAB_FILE}
chmod +x "${CRONTAB_FILE}"
echo "${CRONTAB}" > "${CRONTAB_FILE}"

echo "Successfully written out crontab."
