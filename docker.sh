#!/usr/bin/env bash
#
# A script to build and push docker images.

# Arguments managed using argbash. To re-generate install argbash and run 'argbash docker_args.m4 -o docker_args.sh'
source docker_args.sh

readonly OPERATION=$_arg_operation
readonly MODULE=$_arg_module
readonly TAG=$_arg_tag

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

err() {
  echo -e "$@" >&2
}

build_ui(){
    cd stroom-auth-ui/docker
    ./build.sh $TAG
    cd ../..
}

build_service() {
    local -r SOURCE_DIR="stroom-auth-svc"
    local -r DOCKER_DIR="${SOURCE_DIR}/docker"
    local -r BUILD_DIR="${DOCKER_DIR}/build"
    # Exclude tests because we want this to be fast. I guess you'd better test the build before releasing.
    ./gradlew clean build shadowJar -x test -x integrationTest
    cp -f ${SOURCE_DIR}/config.yml ${BUILD_DIR}/config.yml
    cp -f ${SOURCE_DIR}/build/libs/stroom-auth-service-all.jar ${BUILD_DIR}/stroom-auth-service-all.jar
    cp -f ${SOURCE_DIR}/send_to_stroom* ${BUILD_DIR}
    cp -f ${DOCKER_DIR}/create_crontab.sh ${BUILD_DIR}/create_crontab.sh
    docker build --tag gchq/stroom-auth-service:$TAG ${DOCKER_DIR}/.
}

push_ui() {
    docker push gchq/stroom-auth-ui:$TAG
}

push_service() {
    docker push gchq/stroom-auth-service:$TAG
}

main() {
    setup_echo_colours

    case $OPERATION in
        build)
            echo -e "${GREEN}Building ${BLUE}${MODULE}${GREEN} with tag ${BLUE}${TAG}${NC}"
            case $MODULE in
                ui)
                    build_ui
                ;;
                service)
                    build_service
                ;;
                all)
                    build_ui
                    build_service
                ;;
            esac
        ;;
        push)
            echo -e "${GREEN}Pushing ${BLUE}${MODULE}${GREEN} with tag ${BLUE}${TAG}${NC}"
            case $MODULE in
                ui)
                    push_ui
                ;;
                service)
                    push_service
                ;;
                all)
                    push_ui
                    push_service
                ;;
            esac
        ;;
        publish)
            echo -e "${GREEN}Building and pushing ${BLUE}${MODULE}${GREEN} with tag ${BLUE}${TAG}${NC}"
            case $MODULE in
                ui)
                    build_ui
                    push_ui
                ;;
                service)
                    build_service
                    push_service
                ;;
                all)
                    build_ui
                    push_ui

                    build_service
                    push_service
                ;;
            esac
        ;;
    esac
}

main "$@"