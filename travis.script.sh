#!/bin/bash

#exit script on any error
set -e

#Shell Colour constants for use in 'echo -e'
#e.g.  echo -e "My message ${GREEN}with just this text in green${NC}"
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Colour 

source docker_lib.sh

readonly AUTH_SERVICE_REPO="gchq/stroom-auth-service"
readonly AUTH_SERVICE_CONTEXT_ROOT="stroom-auth-svc/docker/."
readonly AUTH_UI_REPO="gchq/stroom-auth-ui"
readonly AUTH_UI_CONTEXT_ROOT="stroom-auth-ui/docker/."

#This is a whitelist of branches to produce docker builds for
readonly BRANCH_WHITELIST_REGEX='(^dev$|^master$|^v[0-9].*$)'
readonly RELEASE_VERSION_REGEX='^v[0-9]+\.[0-9]+\.[0-9].*$'
readonly LATEST_SUFFIX="-LATEST"

version_fixed_tag=""
snapshot_floating_tag=""
major_ver_floating_tag=""
minor_ver_floating_tag=""
do_docker_build=false
extra_build_args=""

echo_travis_env_vars() {
    # Dump all the travis env vars to the console for debugging
    echo -e "TRAVIS_BUILD_NUMBER: [${GREEN}${TRAVIS_BUILD_NUMBER}${NC}]"
    echo -e "TRAVIS_COMMIT:       [${GREEN}${TRAVIS_COMMIT}${NC}]"
    echo -e "TRAVIS_BRANCH:       [${GREEN}${TRAVIS_BRANCH}${NC}]"
    echo -e "TRAVIS_TAG:          [${GREEN}${TRAVIS_TAG}${NC}]"
    echo -e "TRAVIS_PULL_REQUEST: [${GREEN}${TRAVIS_PULL_REQUEST}${NC}]"
    echo -e "TRAVIS_EVENT_TYPE:   [${GREEN}${TRAVIS_EVENT_TYPE}${NC}]"
}

extract_build_vars() {
    # Normal commit/PR/tag build
    if [ -n "$TRAVIS_TAG" ]; then
        VERSION="${TRAVIS_TAG}"

        do_docker_build=true
        # This is a tagged commit, so create a docker image with that tag
        version_fixed_tag="${TRAVIS_TAG}"

        # Extract the major version part for a floating tag
        majorVer=$(echo "${TRAVIS_TAG}" | grep -oP "v[0-9]+")
        if [ -n "${majorVer}" ]; then
            major_ver_floating_tag="${majorVer}${LATEST_SUFFIX}"
        fi

        # Extract the minor version part for a floating tag
        minorVer=$(echo "${TRAVIS_TAG}" | grep -oP "v[0-9]+\.[0-9]+")
        if [ -n "${minorVer}" ]; then
            minor_ver_floating_tag="${minorVer}${LATEST_SUFFIX}"
        fi

        if [[ "$TRAVIS_BRANCH" =~ ${RELEASE_VERSION_REGEX} ]]; then
            echo "This is a release version so add gradle arg for publishing libs to Bintray"
            extra_build_args="bintrayUpload"
        fi
    elif [[ "$TRAVIS_BRANCH" =~ $BRANCH_WHITELIST_REGEX ]]; then
        # This is a branch we want to create a floating snapshot docker image for
        snapshot_floating_tag="${TRAVIS_BRANCH}-SNAPSHOT"
        do_docker_build=true
    else
        # No tag so use the branch name as the version, e.g. dev
        VERSION="${TRAVIS_BRANCH}"
    fi
}

echo_build_vars() {
    echo -e "VERSION:                       [${GREEN}${VERSION}${NC}]"
    echo -e "version fixed docker tag:      [${GREEN}${version_fixed_tag}${NC}]"
    echo -e "snapshot floating docker tag:  [${GREEN}${snapshot_floating_tag}${NC}]"
    echo -e "major ver floating docker tag: [${GREEN}${major_ver_floating_tag}${NC}]"
    echo -e "minor ver floating docker tag: [${GREEN}${minor_ver_floating_tag}${NC}]"
    echo -e "do_docker_build:               [${GREEN}${do_docker_build}${NC}]"
    echo -e "extra_build_args:              [${GREEN}${extra_build_args}${NC}]"
}

do_gradle_build() {
    # Use 1 local worker to avoid using too much memory as each worker will chew up ~500Mb ram
    ./gradlew -Pversion=$TRAVIS_TAG -PgwtCompilerWorkers=1 -PgwtCompilerMinHeap=50M -PgwtCompilerMaxHeap=500M clean build shadowJar ${extra_build_args}
}

prep_ui_build() {
    pushd ${AUTH_UI_CONTEXT_ROOT}
    echo -e "Building UI from $(pwd)" 
    mkdir -p work
    cp ../package.json work/
    cp -r ../src work/
    cp -r ../public work/
    popd
}    

do_docker_build() {
    # Don't do a docker build for pull requests
    if [ "$do_docker_build" = true ] && [ "$TRAVIS_PULL_REQUEST" = "false" ] ; then
        # TODO - the major and minor floating tags assume that the release builds are all done in strict sequence
        # If say the build for v6.0.1 is re-run after the build for v6.0.2 has run then v6.0-LATEST will point to v6.0.1
        # which is incorrect, hopefully this course of events is unlikely to happen
        all_docker_tags="${version_fixed_tag} ${snapshot_floating_tag} ${major_ver_floating_tag} ${minor_ver_floating_tag}"
        echo -e "all_docker_tags: [${GREEN}${all_docker_tags}${NC}]"

        if [[ $version_fixed_tag == "ui_"* ]]; then
            echo -e "This tag is specific for UI builds, so we'll only build an image for that: ${all_docker_tags}"
           
            prep_ui_build 
            release_to_docker_hub "${AUTH_UI_REPO}" "${AUTH_UI_CONTEXT_ROOT}" ${all_docker_tags}
        elif [[ $version_fixed_tag == "service_"* ]]; then
            echo -e "This tag is specific for service builds, so we'll only build an image for that: ${all_docker_tags}"
           
            prep_service_build
            release_to_docker_hub "${AUTH_SERVICE_REPO}" "${AUTH_SERVICE_CONTEXT_ROOT}" ${all_docker_tags}
        else # But if the tag isn't specifically for UI or service then build for both
            echo -e "Building docker images for both UI and the service."
           
            prep_service_build 
            prep_ui_build 
 
            release_to_docker_hub "${AUTH_UI_REPO}" "${AUTH_UI_CONTEXT_ROOT}" ${all_docker_tags}
            release_to_docker_hub "${AUTH_SERVICE_REPO}" "${AUTH_SERVICE_CONTEXT_ROOT}" ${all_docker_tags}
           
        fi  
    fi
}

release_to_docker_hub() {
    if [ $# -lt 3 ]; then
        echo "Incorrect args, expecting at least 3"
        exit 1
    fi
    docker_repo="$1"
    context_root="$2"
    #shift the the args so we can loop round the open ended list of tags, $1 is now the first tag
    shift 2

    allTagArgs=""

    for tagVersionPart in "$@"; do
        if [ "x${tagVersionPart}" != "x" ]; then
            allTagArgs="${allTagArgs} --tag=${docker_repo}:${tagVersionPart}"
        fi
    done

    echo -e "Building and releasing a docker image to ${GREEN}${docker_repo}${NC} with tags: ${GREEN}${allTagArgs}${NC}"
    echo -e "docker_repo:  [${GREEN}${docker_repo}${NC}]"
    echo -e "context_root: [${GREEN}${context_root}${NC}]"

    #The username and password are configured in the travis gui
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" >/dev/null 2>&1

    docker build ${allTagArgs} ${context_root}
    docker push ${docker_repo} 
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
