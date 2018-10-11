#!/usr/bin/env bash
#
# Re-usable functions for building docker images

build_ui(){
    cd stroom-auth-ui/docker
    ./build.sh $TAG
    cd ../..
}

prep_service_build() {
    local -r SOURCE_DIR="stroom-auth-svc"
    local -r DOCKER_DIR="${SOURCE_DIR}/docker"
    local -r BUILD_DIR="${DOCKER_DIR}/build"
    # Exclude tests because we want this to be fast. I guess you'd better test the build before releasing.
    ./gradlew clean build shadowJar -x test -x integrationTest
    pushd stroom-auth-svc
    ./config.yml.sh
    popd
    mkdir -p ${BUILD_DIR}
    cp -f ${SOURCE_DIR}/config.yml ${BUILD_DIR}/config.yml
    cp -f ${SOURCE_DIR}/build/libs/stroom-auth-service-all.jar ${BUILD_DIR}/stroom-auth-service-all.jar
    cp -f ${SOURCE_DIR}/send_to_stroom* ${BUILD_DIR}
}

build_service() {
    prep_service_build
    docker build --tag gchq/stroom-auth-service:$TAG ${DOCKER_DIR}/.
}

push_ui() {
    docker push gchq/stroom-auth-ui:$TAG
}

push_service() {
    docker push gchq/stroom-auth-service:$TAG
}