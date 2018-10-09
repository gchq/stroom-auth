#!/usr/bin/env bash
#
# A script to send log files to stroom

# Arguments managed using argbash. To re-generate install argbash and run:
# 'argbash send_to_stroom_args.m4 -o send_to_stroom_args.sh'
source send_to_stroom_args.sh

readonly LOG_DIR=$_arg_log_dir
readonly FEED=$_arg_feed
readonly SYSTEM=$_arg_system
readonly ENVIRONMENT=$_arg_environment
readonly STROOM_URL=$_arg_stroom_url
readonly SECURE=$_arg_secure
readonly MAX_SLEEP=$_arg_max_sleep
readonly DELETE_AFTER_SENDING=$_arg_delete_after_sending


readonly LCK_FILE=${LOG_DIR}/`basename $0`.lck
readonly RANDOM=`echo $RANDOM`
readonly MOD=`expr $MAX_SLEEP + 1`
readonly SLEEP=`expr $RANDOM % $MOD`
readonly THIS_PID=`echo $$`


setup_echo_colours() {
    # Exit the script on any error
    set -e

    #Shell Colour constants for use in 'echo -e'
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[1;34m'
    LGREY='\e[37m'
    DGREY='\e[90m'
    NC='\033[0m' # No Color
}



send_files() {
    if [ "${SECURE}" = "false" ]; then
            CURL_OPTS="-k "
            echo -e "${YELLOW}Warn:${NC} Running in insecure mode where we do not check SSL certificates. CURL_OPTS=${CURL_OPTS}"
    else
            CURL_OPTS=""
    fi


    if [ -f "${LCK_FILE}" ]; then
            MYPID=`head -n 1 "${LCK_FILE}"`
            TEST_RUNNING=`ps -p ${MYPID} | grep ${MYPID}`

            if [ -z "${TEST_RUNNING}" ]; then
                    echo -e "${GREEN}Info:${NC} Obtained locked for ${THIS_PID}, processing directory ${LOG_DIR}"
                    echo "${THIS_PID}" > "${LCK_FILE}"
            else
                    echo -e "${GREEN}Info:${NC} Sorry `basename $0` is already running[${MYPID}]"
                    exit 0
            fi
    else
            echo -e "${GREEN}Info:${NC} Obtained locked for ${THIS_PID}, processing directory ${LOG_DIR}"
            echo "${THIS_PID}" > "${LCK_FILE}"
    fi

    echo -e "${GREEN}Info:${NC} Will sleep for ${SLEEP}s to help balance network traffic"
    sleep ${SLEEP}

    for FILE in `find ${LOG_DIR} -name '*.log'`
    do
            echo -e "${GREEN}Info:${NC} Processing ${FILE}"
            RESPONSE_HTTP=`curl ${CURL_OPTS} --write-out "RESPONSE_CODE=%{http_code}" --data-binary @${FILE} "${STROOM_URL}" -H "Feed:${FEED}" -H "System:${SYSTEM}" -H "Environment:${ENVIRONMENT}" 2>&1`
            RESPONSE_LINE=`echo ${RESPONSE_HTTP} | head -1`
            RESPONSE_MSG=`echo ${RESPONSE_HTTP} | grep -o -e RESPONSE_CODE=.*$`
            RESPONSE_CODE=`echo ${RESPONSE_MSG} | cut -f2 -d '='`
            if [ "${RESPONSE_CODE}" != "200" ]
            then
                    echo -e "${RED}Error:${NC} Unable to send file ${FILE}, error was ${RESPONSE_LINE}"
            else
                    echo -e "${GREEN}Info:${NC} Sent File ${FILE}, response code was ${RESPONSE_CODE}"
                    if [ -z ${DELETE_AFTER_SENDING} ]; then
                        echo -e "${YELLOW}Warn:${NC} Deleting successfully sent file ${FILE}"
                        rm ${FILE}
                    fi
            fi
    done

    rm ${LCK_FILE}
}
#
#send_file() {
#    echo -e "send file"
#}

main() {
    setup_echo_colours
    echo -e "${GREEN}Welcome to the send_to_stroom.sh script${NC}"
    echo -e "This script to send log files to Stroom."

    send_files
}

main "$@"