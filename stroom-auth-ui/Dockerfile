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
RUN apk add --no-cache nodejs-current yarn tini
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
EXPOSE 5000
CMD yarn build && serve --single --cors ./build