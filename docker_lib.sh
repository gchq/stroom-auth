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

prep_service_build() {
    pushd stroom-auth-svc
    ./config.yml.sh
    popd
    rm -rf ${SERVICE_BUILD_DIR}
    mkdir -p ${SERVICE_BUILD_DIR}
    echo "Copying build artefacts into Docker build directory" 
    cp -f ${SERVICE_SOURCE_DIR}/config.yml ${SERVICE_BUILD_DIR}/config.yml
    cp -f ${SERVICE_SOURCE_DIR}/build/libs/stroom-auth-service-all.jar ${SERVICE_BUILD_DIR}/stroom-auth-service-all.jar
}

build_service() {
    # Exclude tests because we want this to be fast. I guess you'd better test the build before releasing.
    ./gradlew clean build shadowJar -x test -x integrationTest
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
