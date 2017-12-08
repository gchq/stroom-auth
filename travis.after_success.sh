#!/bin/bash
#TODO: Update this build file to support CRON jobs.

# The username and password are configured in the travis gui
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"

AUTH_SERVICE_TAG="gchq/stroom-auth-service:${TRAVIS_TAG}"
echo "Building stroom-auth-service with tag ${AUTH_SERVICE_TAG}"
docker build --tag=${AUTH_SERVICE_TAG} stroom-auth-svc/.
echo "Pushing ${AUTH_SERVICE_TAG}"
docker push ${AUTH_SERVICE_TAG}

AUTH_UI_TAG="gchq/stroom-auth-ui:${TRAVIS_TAG}"
echo "Building stroom-auth-ui with tag ${AUTH_UI_TAG}"
docker build --tag=${AUTH_UI_TAG} stroom-auth-ui/.
echo "Pushing ${AUTH_UI_IMAGE}"
docker push ${AUTH_UI_TAG}