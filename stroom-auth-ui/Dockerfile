# Copyright 2017 Crown Copyright
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


# ---- Base Node ----
FROM alpine:3.6 AS base
RUN apk add --no-cache \
    nodejs-current \
    yarn \
    tini \
    git \
    # We need full, non-BusyBox sed
    sed \
    # jo is a JSON tool for the command line.
    # We use it to convert environment vars to JSON. We serve this in 'public'.
    --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ jo
RUN yarn global add serve
WORKDIR /root/app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json package.json
RUN yarn install

# ---- Build ----
FROM dependencies AS build
COPY --from=dependencies /root/app/node_modules /root/app/node_modules
COPY src src
COPY public public
COPY ./config.template.* ./
RUN ./config.template.sh prod 
RUN yarn build
RUN mv build/static build/auth/static

# ---- Build ----
FROM base
COPY --from=build /root/app/build /root/app
EXPOSE 5000

# An run-down of the commands below:
#   Get all relevant environment variables...
#   ...remove the AUTH_UI tag...
#   ...lowercase them...
#   ...camelCase them...
#   ...turn them into json...
#   ...save to a file.
#   Serve the statics.
CMD env | grep AUTH_UI | sed 's/AUTH_UI_//g' | awk '{print tolower($0)}' | sed -r 's/_([a-z])/\U\1/g' | jo > auth/config.json && serve --single --cors .