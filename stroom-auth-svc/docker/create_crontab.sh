#!/usr/bin/env bash
#
# Creates the crontab for sending log files to Stroom.

# Construct the send command
readonly SEND_SCRIPT="/stroom-auth-service/send_to_stroom.sh"

readonly ACCESS_LOG_DIR="/stroom-auth-service/logs/access"
readonly APP_LOG_DIR="/stroom-auth-service/logs/app"
readonly EVENT_LOG_DIR="/stroom-auth-service/logs/events"

# Consider changing to this approach, maybe also with crontab -u auth myScript.sh
# https://stackoverflow.com/questions/37015624/how-to-run-a-cron-job-inside-a-docker-container

readonly CRONTAB_DIR="/var/spool/cron/crontabs"
readonly CRON_USER="auth"
readonly CRONTAB_FILE="${CRONTAB_DIR}/root"
#readonly CRONTAB_FILE="${CRONTAB_DIR}/${CRON_USER}"

readonly FILE_REGEX='.*/[a-z]+-[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}\.log'

create_crontab_file() {
    # Create the crontab file -- always over-write so we have the latest from the env vars
    echo "Ensuring /etc/cron.d directory"
    mkdir -p ${CRONTAB_DIR}
    
    echo "Truncating crontab file [${CRONTAB_FILE}]"
    truncate -s 0 ${CRONTAB_FILE}

    if [ -x ${CRONTAB_FILE} ]
    then
        echo "File allready has execute permission"
    else
        echo "Changing file permissions"
        chmod u+x "${CRONTAB_FILE}"

        # This is a bit of a cludge to get round "Text file in use" errors
        # See: https://github.com/moby/moby/issues/9547
        # sync ensures all disk writes are persisted
        sync
    fi

    echo "Created crontab file [${CRONTAB_FILE}]"
}

add_crontab_line(){
    local feed_name=$1
    local file_dir=$2
    local send_command="${SEND_SCRIPT} ${file_dir} ${feed_name} ${LOGS_SYSTEM} ${LOGS_ENV} ${LOGS_STROOM_URL} --file-regex '${FILE_REGEX}' -m ${LOGS_MAX_SLEEP} --no-pretty --delete-after-sending --secure"

    # Construct the crontab line
    local pipe=">> /stroom-auth-service/logs/cron_${feed_name}.log 2>&1"
    #local crontab="${LOGS_CRONTAB:-* * * * *} ${CRON_USER} ${send_command} ${pipe}"
    # alpine cron doesn't seem to allow running as another user
    local crontab="${LOGS_CRONTAB:-* * * * *} ${send_command} ${pipe}"
    echo "Created crontab entry for ${feed_name}: ${crontab}"
    echo "${crontab}" >> "${CRONTAB_FILE}"
}

main() {
    create_crontab_file
    add_crontab_line ${LOGS_EVENT_FEED_NAME} ${EVENT_LOG_DIR}
    add_crontab_line ${LOGS_APP_FEED_NAME} ${APP_LOG_DIR}
    add_crontab_line ${LOGS_ACCESS_FEED_NAME} ${ACCESS_LOG_DIR}

    # Useful for testing
    #echo "* * * * * ${CRON_USER} echo \"Cron running\" >> /tmp/myCron.log 2>&1" >> "${CRONTAB_FILE}"

    # Ensure we have a blank line at the bottom
    echo "" >> "${CRONTAB_FILE}"

    echo "Contents of ${CRONTAB_FILE}"
    cat ${CRONTAB_FILE}
}

main "$@"
