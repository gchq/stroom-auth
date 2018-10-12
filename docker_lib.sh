#!/usr/bin/env bash
#
# Re-usable functions for building docker images

readonly SERVICE_SOURCE_DIR="stroom-auth-svc"
readonly SERVICE_DOCKER_DIR="${SERVICE_SOURCE_DIR}/docker"
readonly SERVICE_BUILD_DIR="${SERVICE_DOCKER_DIR}/build"

build_ui(){
    cd stroom-auth-ui/docker
    ./build.sh $TAG
    cd ../..
}

get_send_to_stroom_scripts() {
    pushd stroom-auth-svc/docker/build

    curl https://raw.githubusercontent.com/gchq/stroom-clients/master/bash/send_to_stroom.sh >> send_to_stroom.sh
    curl https://raw.githubusercontent.com/gchq/stroom-clients/master/bash/send_to_stroom_args.sh >> send_to_stroom_args.sh

    chmod +x send_to_stroom.sh
    chmod +x send_to_stroom_args.sh

    popd
}

prep_service_build() {

    # Exclude tests because we want this to be fast. I guess you'd better test the build before releasing.
    ./gradlew clean build shadowJar -x test -x integrationTest
    pushd stroom-auth-svc
    ./config.yml.sh
    popd
    rm -rf ${SERVICE_BUILD_DIR}
    mkdir -p ${SERVICE_BUILD_DIR}
    cp -f ${SERVICE_SOURCE_DIR}/config.yml ${SERVICE_BUILD_DIR}/config.yml
    cp -f ${SERVICE_SOURCE_DIR}/build/libs/stroom-auth-service-all.jar ${SERVICE_BUILD_DIR}/stroom-auth-service-all.jar
    get_send_to_stroom_scripts
}

build_service() {
    prep_service_build
    echo "--${TAG}--"
    echo "--${SERVICE_DOCKER_DIR}--"
    docker build --tag gchq/stroom-auth-service:$TAG ${SERVICE_DOCKER_DIR}/.
}

push_ui() {
    docker push gchq/stroom-auth-ui:$TAG
}

push_service() {
    docker push gchq/stroom-auth-service:$TAG
}