#!/bin/bash

#exit script on any error
set -e

GITHUB_REPO="gchq/stroom-auth"
GITHUB_API_URL="https://api.github.com/repos/gchq/stroom-auth/releases"
DOCKER_CONTEXT_ROOT="stroom-auth-svc/."
VERSION_FIXED_TAG=""
SNAPSHOT_FLOATING_TAG=""
MAJOR_VER_FLOATING_TAG=""
MINOR_VER_FLOATING_TAG=""
#This is a whitelist of branches to produce docker builds for
BRANCH_WHITELIST_REGEX='(^dev$|^master$|^v[0-9].*$)'
RELEASE_VERSION_REGEX='^v[0-9]+\.[0-9]+\.[0-9].*$'
CRON_TAG_SUFFIX="DAILY"
doDockerBuild=false

#Shell Colour constants for use in 'echo -e'
#e.g.  echo -e "My message ${GREEN}with just this text in green${NC}"
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Colour 

createGitTag() {
    tagName=$1

    git config --global user.email "builds@travis-ci.com"
    git config --global user.name "Travis CI"

    echo -e "Tagging commit [${GREEN}${TRAVIS_COMMIT}${NC}] with tag [${GREEN}${tagName}${NC}]"
    git tag -a ${tagName} ${TRAVIS_COMMIT} -m "Automated Travis build $TRAVIS_BUILD_NUMBER" >/dev/null 2>&1
    #TAGPERM is a travis encrypted github token, see 'env' section in .travis.yml
    git push -q https://$TAGPERM@github.com/${GITHUB_REPO} ${tagName} >/dev/null 2>&1
}

isCronBuildRequired() {
    #GH_USER_AND_TOKEN is set in env section of .travis.yml
    if [ "${GH_USER_AND_TOKEN}x" = "x" ]; then
        #no token so do it unauthenticated
        authArgs=""
    else
        echo "Using authentication with curl"
        authArgs="--user ${GH_USER_AND_TOKEN}"
    fi
    #query the github api for the latest cron release tag name
    #redirect stderr to dev/null to protect api token
    latestTagName=$(curl -s ${authArgs} ${GITHUB_API_URL} | \
        jq -r "[.[] | select(.tag_name | test(\"${TRAVIS_BRANCH}.*${CRON_TAG_SUFFIX}\"))][0].tag_name" 2>/dev/null)
    echo -e "Latest release ${CRON_TAG_SUFFIX} tag: [${GREEN}${latestTagName}${NC}]"

    if [ "${latestTagName}x" != "x" ]; then
        #Get the commit sha that this tag applies to (not the commit of the tag itself)
        shaForTag=$(git rev-list -n 1 "${latestTagName}")
        echo -e "SHA hash for tag ${latestTagName}: [${GREEN}${shaForTag}${NC}]"
        if [ "${shaForTag}x" = "x" ]; then
            echo -e "${RED}Unable to get sha for tag ${BLUE}${latestTagName}${NC}"
            exit 1
        else
            if [ "${shaForTag}x" = "${TRAVIS_COMMIT}x" ]; then
                echo -e "${RED}The commit of the build matches the latest ${CRON_TAG_SUFFIX} release.${NC}"
                echo -e "${RED}Git will not be tagged and no release will be made.${NC}"
                #The latest release has the same commit sha as the commit travis is building
                #so don't bother creating a new tag as we don't want a new release
                false
            fi
        fi
    else
        #no release found so return true so a build happens
        true
    fi
    return
}

buildAndPublish() {
    DOCKER_REPO=$1

    if [ "$TRAVIS_EVENT_TYPE" = "cron" ]; then
        echo "This is a cron build so just tag the commit if we need to and exit"


        if isCronBuildRequired; then
            echo "The release build will happen when travis picks up the tagged commit"
            #This is a cron triggered build so tag as -DAILY and push a tag to git
            DATE_ONLY="$(date +%Y%m%d)"
            gitTag="${STROOM_VERSION}-${DATE_ONLY}-${CRON_TAG_SUFFIX}"

            createGitTag ${gitTag}
        fi
    else
        #Normal commit/PR/tag build
        extraBuildArgs=""

        if [ -n "$TRAVIS_TAG" ]; then
            doDockerBuild=true

            #This is a tagged commit, so create a docker image with that tag
            VERSION_FIXED_TAG="--tag=${DOCKER_REPO}:${TRAVIS_TAG}"

            #Extract the major version part for a floating tag
            majorVer=$(echo "${TRAVIS_TAG}" | grep -oP "^v[0-9]+")
            if [ -n "${majorVer}" ]; then
                MAJOR_VER_FLOATING_TAG="--tag=${DOCKER_REPO}:${majorVer}-LATEST"
            fi

            #Extract the minor version part for a floating tag
            minorVer=$(echo "${TRAVIS_TAG}" | grep -oP "^v[0-9]+\.[0-9]+")
            if [ -n "${minorVer}" ]; then
                MINOR_VER_FLOATING_TAG="--tag=${DOCKER_REPO}:${minorVer}-latest"
            fi

            if [[ "$TRAVIS_BRANCH" =~ ${RELEASE_VERSION_REGEX} ]]; then
                echo "This is a release version so add gradle arg for publishing libs to Bintray"
                extraBuildArgs="bintrayUpload"
            fi
        elif [[ "$TRAVIS_BRANCH" =~ $BRANCH_WHITELIST_REGEX ]]; then
            #This is a branch we want to create a floating snapshot docker image for
            SNAPSHOT_FLOATING_TAG="--tag=${DOCKER_REPO}:${STROOM_VERSION}-SNAPSHOT"
            doDockerBuild=true
        fi

        echo -e "VERSION FIXED DOCKER TAG:      [${GREEN}${VERSION_FIXED_TAG}${NC}]"
        echo -e "SNAPSHOT FLOATING DOCKER TAG:  [${GREEN}${SNAPSHOT_FLOATING_TAG}${NC}]"
        echo -e "MAJOR VER FLOATING DOCKER TAG: [${GREEN}${MAJOR_VER_FLOATING_TAG}${NC}]"
        echo -e "MINOR VER FLOATING DOCKER TAG: [${GREEN}${MINOR_VER_FLOATING_TAG}${NC}]"
        echo -e "doDockerBuild:                 [${GREEN}${doDockerBuild}${NC}]"
        echo -e "extraBuildArgs:                [${GREEN}${extraBuildArgs}${NC}]"

        #Do the gradle build
        # Use 1 local worker to avoid using too much memory as each worker will chew up ~500Mb ram
        ./gradlew -Pversion=$TRAVIS_TAG -PgwtCompilerWorkers=1 -PgwtCompilerMinHeap=50M -PgwtCompilerMaxHeap=500M clean build ${extraBuildArgs}

        #Don't do a docker build for pull requests
        if [ "$doDockerBuild" = true ] && [ "$TRAVIS_PULL_REQUEST" = "false" ] ; then
            #TODO - the major and minor floating tags assume that the release builds are all done in strict sequence
            #If an old release build is re-run then it may result in a -LATEST tag pointing to a version that isn't the latest
            #however this is unlikely to happen
            allDockerTags="${VERSION_FIXED_TAG} ${SNAPSHOT_FLOATING_TAG} ${MAJOR_VER_FLOATING_TAG} ${MINOR_VER_FLOATING_TAG}"
            echo -e "Building a docker image with tags: ${GREEN}${allDockerTags}${NC}"

            #The username and password are configured in the travis gui
            docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" >/dev/null 2>&1
            docker build ${allDockerTags} ${DOCKER_CONTEXT_ROOT} >/dev/null 2>&1
            docker push ${DOCKER_REPO} >/dev/null 2>&1
        fi

        #Deploy the generated swagger specs and swagger UI (obtained from github) to gh-pages
        if [ "$TRAVIS_BRANCH" = "master" ]; then
            echo "Deploying swagger-ui to gh-pages"
            ghPagesDir=$TRAVIS_BUILD_DIR/gh-pages
            swaggerUiCloneDir=$TRAVIS_BUILD_DIR/swagger-ui
            mkdir -p $ghPagesDir
            #copy our generated swagger specs to gh-pages
            cp $TRAVIS_BUILD_DIR/stroom-app/src/main/resources/ui/swagger/swagger.* $ghPagesDir/
            #clone swagger-ui repo so we can get the ui html/js/etc
            git clone --depth 1 https://github.com/swagger-api/swagger-ui.git $swaggerUiCloneDir
            #copy the bits of swagger-ui that we need
            cp -r $swaggerUiCloneDir/dist/* $ghPagesDir/
            #repalce the default swagger spec url in swagger UI
            sed -i 's#url: ".*"#url: "https://gchq.github.io/stroom/swagger.json"#g' $ghPagesDir/index.html
        fi
    fi
}

#establish what version we are building
if [ -n "$TRAVIS_TAG" ]; then
    #Tagged commit so use that as our version, e.g. v1.2.3
    PRODUCT_VERSION="${TRAVIS_TAG}"

    #upload the maven artefacts to bintray
    EXTRA_BUILD_ARGS="bintrayUpload"
else
    #No tag so use the branch name as the version, e.g. dev-SNAPSHOT
    #None tagged builds are NOT pushed to bintray
    PRODUCT_VERSION="SNAPSHOT"
    EXTRA_BUILD_ARGS=""
fi

#Dump all the travis env vars to the console for debugging
echo -e "TRAVIS_BUILD_NUMBER:  [${GREEN}${TRAVIS_BUILD_NUMBER}${NC}]"
echo -e "TRAVIS_COMMIT:        [${GREEN}${TRAVIS_COMMIT}${NC}]"
echo -e "TRAVIS_BRANCH:        [${GREEN}${TRAVIS_BRANCH}${NC}]"
echo -e "TRAVIS_TAG:           [${GREEN}${TRAVIS_TAG}${NC}]"
echo -e "TRAVIS_PULL_REQUEST:  [${GREEN}${TRAVIS_PULL_REQUEST}${NC}]"
echo -e "TRAVIS_EVENT_TYPE:    [${GREEN}${TRAVIS_EVENT_TYPE}${NC}]"
echo -e "PRODUCT_VERSION:      [${GREEN}${PRODUCT_VERSION}${NC}]"

buildAndPublish 'stroom-auth-ui'
buildAndPublish 'stroom-auth-service'

exit 0
