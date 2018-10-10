#!/usr/bin/env bash
#
# Creates the crontab for sending log files to Stroom.

readonly SEND_SCRIPT="/usr/stroom-auth-service/send_to_stroom.sh"
readonly LOG_DIR="/usr/stroom-auth-service/logs/events"
send_command="${SEND_SCRIPT} ${LOG_DIR} ${SEND_LOGS_FEED_NAME} ${SEND_LOGS_SYSTEM} ${SEND_LOGS_ENV} ${SEND_LOGS_STROOM_URL} -m ${SEND_LOGS_MAX_SLEEP} --no_pretty --delete_after_sending"
#TODO: Add param for secure

echo "send_to_stroom.sh command will be ${send_command}"

readonly PIPE=">> /usr/stroom-auth-service/logs/cron.log 2>&1"

readonly CRONTAB="${SEND_LOGS_CRONTAB} ${send_command} ${PIPE}"

echo "crontab for sending logs will be ${CRONTAB}"

readonly CRONTAB_FILE="/etc/cron.d/send-logs-cron"

## Overwrite the existing cron so we always get the latest from the env vars
mkdir -p /etc/cron.d
touch ${CRONTAB_FILE}
echo "${CRONTAB}" > "${CRONTAB_FILE}"

chmod +x "${CRONTAB_FILE}"
cat "${CRONTAB_FILE}"

echo "Successfully written out crontab."
