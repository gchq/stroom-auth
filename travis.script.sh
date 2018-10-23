#!/bin/bash

#exit script on any error
set -e

source docker_lib.sh

AUTH_SERVICE_REPO="gchq/stroom-auth-service"
AUTH_SERVICE_CONTEXT_ROOT="stroom-auth-svc/docker/."

AUTH_UI_REPO="gchq/stroom-auth-ui"
AUTH_UI_CONTEXT_ROOT="stroom-auth-ui/docker/."

VERSION_FIXED_TAG=""
SNAPSHOT_FLOATING_TAG=""
MAJOR_VER_FLOATING_TAG=""
MINOR_VER_FLOATING_TAG=""
#This is a whitelist of branches to produce docker builds for
BRANCH_WHITELIST_REGEX='(^dev$|^master$|^v[0-9].*$)'
RELEASE_VERSION_REGEX='^v[0-9]+\.[0-9]+\.[0-9].*$'
LATEST_SUFFIX="-LATEST"
do_docker_build=false
extra_build_args=""

#Shell Colour constants for use in 'echo -e'
#e.g.  echo -e "My message ${GREEN}with just this text in green${NC}"
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Colour 

#args: dockerRepo contextRoot tag1VersionPart tag2VersionPart ... tagNVersionPart
release_service_to_docker_hub() {
    #echo "release_service_to_docker_hub called with args [$@]"

    if [ $# -lt 3 ]; then
        echo "Incorrect args, expecting at least 3"
        exit 1
    fi
    dockerRepo="$1"
    contextRoot="$2"
    #shift the the args so we can loop round the open ended list of tags, $1 is now the first tag
    shift 2

    allTagArgs=""

    for tagVersionPart in "$@"; do
        if [ "x${tagVersionPart}" != "x" ]; then
            #echo -e "Adding docker tag [${GREEN}${tagVersionPart}${NC}]"
            allTagArgs="${allTagArgs} --tag=${dockerRepo}:${tagVersionPart}"
        fi
    done

    echo -e "Building and releasing a docker image to ${GREEN}${dockerRepo}${NC} with tags: ${GREEN}${allTagArgs}${NC}"
    echo -e "dockerRepo:  [${GREEN}${dockerRepo}${NC}]"
    echo -e "contextRoot: [${GREEN}${contextRoot}${NC}]"

    prep_service_build

    # The username and password are configured in the travis gui
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" >/dev/null 2>&1

    docker build ${allTagArgs} ${contextRoot}
    docker push ${dockerRepo}
}

release_auth_ui_to_docker_hub() {
    #echo "release_auth_ui_to_docker_hub called with args [$@]"

    if [ $# -lt 3 ]; then
        echo "Incorrect args, expecting at least 3"
        exit 1
    fi
    dockerRepo="$1"
    contextRoot="$2"
    #shift the the args so we can loop round the open ended list of tags, $1 is now the first tag
    shift 2

    allTagArgs=""

    for tagVersionPart in "$@"; do
        if [ "x${tagVersionPart}" != "x" ]; then
            #echo -e "Adding docker tag [${GREEN}${tagVersionPart}${NC}]"
            allTagArgs="${allTagArgs} --tag=${dockerRepo}:${tagVersionPart}"
        fi
    done

    echo -e "Building and releasing a docker image to ${GREEN}${dockerRepo}${NC} with tags: ${GREEN}${allTagArgs}${NC}"
    echo -e "dockerRepo:  [${GREEN}${dockerRepo}${NC}]"
    echo -e "contextRoot: [${GREEN}${contextRoot}${NC}]"

    #The username and password are configured in the travis gui
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" >/dev/null 2>&1

    ./stroom-auth-ui/docker/build.sh ${tagVersionPart}
    docker push ${dockerRepo} >/dev/null 2>&1
}

echo_travis_env_vars() {
    # Dump all the travis env vars to the console for debugging
    echo -e "TRAVIS_BUILD_NUMBER: [${GREEN}${TRAVIS_BUILD_NUMBER}${NC}]"
    echo -e "TRAVIS_COMMIT:       [${GREEN}${TRAVIS_COMMIT}${NC}]"
    echo -e "TRAVIS_BRANCH:       [${GREEN}${TRAVIS_BRANCH}${NC}]"
    echo -e "TRAVIS_TAG:          [${GREEN}${TRAVIS_TAG}${NC}]"
    echo -e "TRAVIS_PULL_REQUEST: [${GREEN}${TRAVIS_PULL_REQUEST}${NC}]"
    echo -e "TRAVIS_EVENT_TYPE:   [${GREEN}${TRAVIS_EVENT_TYPE}${NC}]"
}

echo_build_vars() {
    echo -e "VERSION:                       [${GREEN}${VERSION}${NC}]"
    echo -e "VERSION FIXED DOCKER TAG:      [${GREEN}${VERSION_FIXED_TAG}${NC}]"
    echo -e "SNAPSHOT FLOATING DOCKER TAG:  [${GREEN}${SNAPSHOT_FLOATING_TAG}${NC}]"
    echo -e "MAJOR VER FLOATING DOCKER TAG: [${GREEN}${MAJOR_VER_FLOATING_TAG}${NC}]"
    echo -e "MINOR VER FLOATING DOCKER TAG: [${GREEN}${MINOR_VER_FLOATING_TAG}${NC}]"
    echo -e "do_docker_build:               [${GREEN}${do_docker_build}${NC}]"
    echo -e "extra_build_args:              [${GREEN}${extra_build_args}${NC}]"
}

extract_build_vars() {
    # Normal commit/PR/tag build
    if [ -n "$TRAVIS_TAG" ]; then
        VERSION="${TRAVIS_TAG}"

        do_docker_build=true

        # This is a tagged commit, so create a docker image with that tag
        VERSION_FIXED_TAG="${TRAVIS_TAG}"

        # Extract the major version part for a floating tag
        majorVer=$(echo "${TRAVIS_TAG}" | grep -oP "^v[0-9]+")
        if [ -n "${majorVer}" ]; then
            MAJOR_VER_FLOATING_TAG="${majorVer}${LATEST_SUFFIX}"
        fi

        # Extract the minor version part for a floating tag
        minorVer=$(echo "${TRAVIS_TAG}" | grep -oP "^v[0-9]+\.[0-9]+")
        if [ -n "${minorVer}" ]; then
            MINOR_VER_FLOATING_TAG="${minorVer}${LATEST_SUFFIX}"
        fi

        if [[ "$TRAVIS_BRANCH" =~ ${RELEASE_VERSION_REGEX} ]]; then
            echo "This is a release version so add gradle arg for publishing libs to Bintray"
            extra_build_args="bintrayUpload"
        fi
    elif [[ "$TRAVIS_BRANCH" =~ $BRANCH_WHITELIST_REGEX ]]; then
        # This is a branch we want to create a floating snapshot docker image for
        SNAPSHOT_FLOATING_TAG="${VERSION}-SNAPSHOT"
        do_docker_build=true
    else
        # No tag so use the branch name as the version, e.g. dev
        VERSION="${TRAVIS_BRANCH}"
    fi
}

do_gradle_build() {
    # Use 1 local worker to avoid using too much memory as each worker will chew up ~500Mb ram
    ./gradlew -Pversion=$TRAVIS_TAG -PgwtCompilerWorkers=1 -PgwtCompilerMinHeap=50M -PgwtCompilerMaxHeap=500M clean build shadowJar ${extra_build_args}
}

do_docker_build() {
    # Don't do a docker build for pull requests
    if [ "$do_docker_build" = true ] && [ "$TRAVIS_PULL_REQUEST" = "false" ] ; then
        # TODO - the major and minor floating tags assume that the release builds are all done in strict sequence
        # If say the build for v6.0.1 is re-run after the build for v6.0.2 has run then v6.0-LATEST will point to v6.0.1
        # which is incorrect, hopefully this course of events is unlikely to happen
        all_docker_tags="${VERSION_FIXED_TAG} ${SNAPSHOT_FLOATING_TAG} ${MAJOR_VER_FLOATING_TAG} ${MINOR_VER_FLOATING_TAG}"
        echo -e "all_docker_tags: [${GREEN}${all_docker_tags}${NC}]"

        # Build and release the stroom-stats image to dockerhub
        release_service_to_docker_hub "${AUTH_SERVICE_REPO}" "${AUTH_SERVICE_CONTEXT_ROOT}" ${all_docker_tags}
        release_auth_ui_to_docker_hub "${AUTH_UI_REPO}" "${AUTH_UI_CONTEXT_ROOT}" ${all_docker_tags}
    fi
}

main() {
    echo_travis_env_vars
    extract_build_vars
    echo_build_vars
    do_gradle_build
    do_docker_build
    exit 0
}

main "$@"