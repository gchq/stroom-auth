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

FROM openjdk:10.0.2-jre-slim

# TODO consider consistency with stroom/stroom-proxy, i.e. /stroom-auth-svc/
WORKDIR /stroom-auth-service

VOLUME [ "/stroom-auth-service/logs" ]

# run entrypoint script inside tini for better unix process handling, 
# see https://github.com/krallin/tini/issues/8
#ENTRYPOINT ["/sbin/tini", "--", "./docker-entrypoint.sh"]
ENTRYPOINT ["tini", "--", "./docker-entrypoint.sh"]

CMD ./run.sh

RUN apt-get update && \
    apt-get install -y \
        cron \
        gosu \
        tini && \
    rm -rf /var/lib/apt/lists/* && \
    addgroup --system --gid 1000 auth && \
    adduser --system --uid 1000 --shell /bin/false --ingroup auth auth && \
    mkdir -p /stroom-auth-service && \
    mkdir -p /stroom-auth-service/logs/access && \
    mkdir -p /stroom-auth-service/logs/events && \
    mkdir -p /stroom-auth-service/logs/app && \
    chown -R auth:auth /stroom-auth-service

COPY --chown=auth:auth ./build/send_to_stroom_args.sh /stroom-auth-service/
COPY --chown=auth:auth ./build/send_to_stroom.sh /stroom-auth-service/
COPY --chown=auth:auth ./create_crontab.sh /stroom-auth-service/
COPY --chown=auth:auth ./run.sh /stroom-auth-service/
COPY --chown=auth:auth ./docker-entrypoint.sh /stroom-auth-service/
COPY --chown=auth:auth ./build/config.yml /stroom-auth-service/
COPY --chown=auth:auth ./build/stroom-auth-service-all.jar /stroom-auth-service/

