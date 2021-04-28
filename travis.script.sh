#!/bin/bash

#exit script on any error
set -e

# shellcheck disable=SC2034
{
    #Shell Colour constants for use in 'echo -e'
    #e.g.  echo -e "My message ${GREEN}with just this text in green${NC}"
    RED='\033[1;31m'
    GREEN='\033[1;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[1;34m'
    NC='\033[0m' # No Colour 
}

source docker_lib.sh

readonly AUTH_SERVICE_REPO="gchq/stroom-auth-service"
readonly AUTH_SERVICE_CONTEXT_ROOT="stroom-auth-svc/docker/."

readonly AUTH_UI_REPO="gchq/stroom-auth-ui"
readonly AUTH_UI_CONTEXT_ROOT="stroom-auth-ui/docker/."

# This is a whitelist of branches to produce docker builds for
readonly BRANCH_WHITELIST_REGEX='(^dev$|^master$|^[0-9]+\.[0-9]+.*$)'

# Tags matching this regex will trigger a bintray release
readonly RELEASE_VERSION_REGEX='^v[0-9]+\.[0-9]+.*$'

readonly LATEST_SUFFIX="-LATEST"

version_fixed_tag=""
snapshot_floating_tag=""
major_ver_floating_tag=""
minor_ver_floating_tag=""
do_docker_build=false
extra_build_args=()

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
        echo -e "This is a tagged build"
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

        if [[ "$TRAVIS_TAG" =~ ${RELEASE_VERSION_REGEX} ]]; then
            echo "This is a release version so add gradle arg for publishing libs to Bintray"
            # GPG sign the artifacts, publish to nexus then close and release
            # the staging repo to the public nexus repo and on to central
            extra_build_args=( 
                "signMavenJavaPublication"
                "publishToSonatype"
                "closeSonatypeStagingRepository"
                #"closeAndReleaseSonatypeStagingRepository"
            )
        fi
    elif [[ "$TRAVIS_BRANCH" =~ $BRANCH_WHITELIST_REGEX ]]; then
        echo -e "This is a white-listed branch build"
        # This is a branch we want to create a floating snapshot docker image for
        snapshot_floating_tag="${TRAVIS_BRANCH}-SNAPSHOT"
        do_docker_build=true
        VERSION="${TRAVIS_BRANCH}-SNAPSHOT"
    else
        # No tag so use the branch name as the version, e.g. dev
        VERSION="${TRAVIS_BRANCH}-SNAPSHOT"
    fi
}

echo_build_vars() {
    echo -e "VERSION:                       [${GREEN}${VERSION}${NC}]"
    echo -e "version fixed docker tag:      [${GREEN}${version_fixed_tag}${NC}]"
    echo -e "snapshot floating docker tag:  [${GREEN}${snapshot_floating_tag}${NC}]"
    echo -e "major ver floating docker tag: [${GREEN}${major_ver_floating_tag}${NC}]"
    echo -e "minor ver floating docker tag: [${GREEN}${minor_ver_floating_tag}${NC}]"
    echo -e "do_docker_build:               [${GREEN}${do_docker_build}${NC}]"
    echo -e "extra_build_args:              [${GREEN}${extra_build_args[*]}${NC}]"
}

do_gradle_build() {
    # If -pversion is not set, the build will use a default
    ./gradlew \
        -Pversion="${TRAVIS_TAG}" \
        clean \
        build \
        shadowJar \
        "${extra_build_args[@]}"
}

prep_ui_build() {
    pushd ${AUTH_UI_CONTEXT_ROOT}
    echo -e "Building UI from $(pwd)" 
    mkdir -p work
    cp ../package.json work/
    cp ../yarn.lock work/
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
        all_docker_tags=(
            "${version_fixed_tag}"
            "${snapshot_floating_tag}"
            "${major_ver_floating_tag}"
            "${minor_ver_floating_tag}"
        )
        echo -e "all_docker_tags: [${GREEN}${all_docker_tags[*]}${NC}]"

        echo -e "Building docker images for both UI and the service."

        echo -e "Preparing for service docker build"
        prep_ui_build 
        release_to_docker_hub \
            "${AUTH_UI_REPO}" \
            "${AUTH_UI_CONTEXT_ROOT}" \
            "${all_docker_tags[@]}"

        echo -e "Preparing for ui docker build"
        prep_service_build 
        release_to_docker_hub \
            "${AUTH_SERVICE_REPO}" \
            "${AUTH_SERVICE_CONTEXT_ROOT}" \
            "${all_docker_tags[@]}"
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

    all_tag_args=()

    for tag_version_part in "$@"; do
        if [ "x${tag_version_part}" != "x" ]; then
            all_tag_args+=("--tag=${docker_repo}:${tag_version_part}")
        fi
    done

    echo -e "Building a docker image with tags: ${GREEN}${all_tag_args[*]}${NC}"
    echo -e "docker_repo:  [${GREEN}${docker_repo}${NC}]"
    echo -e "context_root: [${GREEN}${context_root}${NC}]"

    # If we have a TRAVIS_TAG (git tag) then use that, else use the floating tag
    docker build \
        "${all_tag_args[@]}" \
        --build-arg GIT_COMMIT="${TRAVIS_COMMIT}" \
        --build-arg GIT_TAG="${TRAVIS_TAG:-${snapshot_floating_tag}}" \
        "${context_root}"

    echo -e "Logging in to Docker"

    #The username and password are configured in the travis gui
    echo "$DOCKER_PASSWORD" \
        | docker login -u "$DOCKER_USERNAME" --password-stdin >/dev/null 2>&1

    echo -e "Pushing the docker image to ${GREEN}${docker_repo}${NC}" \
        "with tags: ${GREEN}${all_tag_args[*]}${NC}"
    docker push "${docker_repo}" >/dev/null 2>&1

    echo -e "Logging out of Docker"
    docker logout >/dev/null 2>&1
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
# vim: set tabstop=4 shiftwidth=4 expandtab:
