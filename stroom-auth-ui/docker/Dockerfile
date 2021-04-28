#**********************************************************************
# Copyright 2018 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#**********************************************************************



# ~~~ builder stage ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# Set unsafe-perm to stop errors in npm install, due, in part, to running
# as root
FROM node:10.24.1-alpine3.11 AS builder
WORKDIR /root/app
RUN apk add --no-cache \
      git
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



# ~~~ Dependencies stage ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FROM builder AS dependencies
COPY work/package.json package.json
COPY work/yarn.lock yarn.lock
# Use lockfile for repeatable builds
RUN yarn --frozen-lockfile install
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



# ~~~ Build stage ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FROM dependencies AS build
COPY --from=dependencies /root/app/node_modules /root/app/node_modules
COPY work/src src
COPY work/public public
RUN yarn build
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



# ~~~ Final stage ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
FROM nginx:1.20.0-alpine
WORKDIR /root/app

# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 5000
EXPOSE 9443

VOLUME [ "/etc/nginx/certs" ]

# An explanation of the commands below:
#   Get all relevant environment variables...
#   ...remove the AUTH_UI tag...
#   ...lowercase them...
#   ...camelCase them...
#   ...turn them into json...
#   ...save to a file.
#   Do environment variable substitution for nginx.conf
#   Serve the statics.
CMD env | grep AUTH_UI | \
    sed 's/AUTH_UI_//g' | sed -e 's/\(.*=\)/\L&/' | sed -r 's/_([a-z])/\U\1/g' | \
    jo > /usr/share/nginx/html/config.json \
    && envsubst '${NGINX_HOST} \
                ${NGINX_HTTP_PORT} \
                ${NGINX_HTTPS_PORT} \
                ${NGINX_SSL_CERTIFICATE} \
                ${NGINX_SSL_CERTIFICATE_KEY} \
                ${NGINX_SSL_CLIENT_CERTIFICATE}' \
            < /etc/nginx/template/nginx.conf.template > /etc/nginx/nginx.conf \
    && nginx -g 'daemon off;'


# We need full, non-BusyBox sed
# jo is a JSON tool for generating json output on the command line.
# We use it to convert environment vars to JSON. We serve this in 'public'.
# Create a user:group auth:auth to run as
# Use a uid/gid of 1000 as this is more likely to match the host user
# in development
RUN apk add --no-cache \
        tini \
        sed \
        --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ jo

COPY --from=build /root/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Label the image so we can see what commit/tag it came from
ARG GIT_COMMIT=unspecified
ARG GIT_TAG=unspecified
LABEL \
    git_commit="$GIT_COMMIT" \
    git_tag="$GIT_TAG"
