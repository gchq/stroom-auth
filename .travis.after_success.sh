#!/bin/bash
CURRENT_STROOM_DEV_VERSION="v6.0.0"
DOCKER_REPO="gchq/stroom-auth"
DATE_ONLY="$(date +%Y%m%d)"
DATE_TIME="$(date +%Y%m%d%H%M%S)"
FLOATING_TAG=""
SPECIFIC_TAG=""

# Establish what version of stroom we are building
if [ -n "$TRAVIS_TAG" ]; then
    STROOM_VERSION=${TRAVIS_TAG}
else
    STROOM_VERSION=${CURRENT_STROOM_DEV_VERSION}
fi


if [ "$TRAVIS_EVENT_TYPE" = "cron" ]; then
    # This is a cron triggered build so tag as -DAILY and push a tag to git
    versionStr="${STROOM_VERSION}-${DATE_ONLY}-DAILY"
    echo "versionStr: ${versionStr}"
    SPECIFIC_TAG="--tag=${DOCKER_REPO}:${versionStr}"
    echo "SPECIFIC_TAG: ${SPECIFIC_TAG}"
    gitTag=${versionStr}
    echo "gitTag: ${gitTag}"
    echo "commit hash: ${TRAVIS_COMMIT}"

    git config --global user.email "builds@travis-ci.com"
    git config --global user.name "Travis CI"

    git tag -a ${gitTag} ${TRAVIS_COMMIT} -m "Automated Travis build $TRAVIS_BUILD_NUMBER"
    git push -q https://$TAGPERM@github.com/gchq/stroom-auth --follow-tags
elif [ -n "$TRAVIS_TAG" ]; then
    SPECIFIC_TAG="--tag=${DOCKER_REPO}:${TRAVIS_TAG}"
    echo "SPECIFIC_TAG: ${SPECIFIC_TAG}"
elif [ "$TRAVIS_BRANCH" = "dev" ]; then
    FLOATING_TAG="--tag=${DOCKER_REPO}:${STROOM_VERSION}-SNAPSHOT"
    echo "FLOATING_TAG: ${FLOATING_TAG}"
fi


# Do a docker build for git tags, dev branch or cron builds
if [ "$TRAVIS_BRANCH" = "dev" ] || [ -n "$TRAVIS_TAG" ] || [ "$TRAVIS_EVENT_TYPE" = "cron" ]; then
    if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
        echo "Using tags: ${SPECIFIC_TAG} ${FLOATING_TAG}"

        # The username and password are configured in the travis gui
        docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
        AUTH_SERVICE_TAG = "stroom-auth-svc_${SPECIFIC_TAG}"
        AUTH_UI_TAG = "stroom-auth-ui_${SPECIFIC_TAG}"
        docker build ${AUTH_SERVICE_TAG} stroom-auth-svc/.
        docker build ${AUTH_UI_TAG} stroom-auth-ui/.
        docker push gchq/stroom-auth
    fi
fi


