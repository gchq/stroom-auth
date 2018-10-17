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
WORKDIR /usr/stroom-auth-service

VOLUME [ "/usr/stroom-auth-service/logs" ]

CMD run.sh

RUN apt-get update && apt-get install -y cron

COPY ./build/send_to_stroom_args.sh /usr/stroom-auth-service/send_to_stroom_args.sh
COPY ./build/send_to_stroom.sh /usr/stroom-auth-service/send_to_stroom.sh
COPY ./create_crontab.sh /usr/stroom-auth-service/create_crontab.sh
COPY ./run.sh /usr/stroom-auth-service/run.sh
COPY ./build/config.yml /usr/stroom-auth-service/config.yml
COPY ./build/stroom-auth-service-all.jar /usr/stroom-auth-service/stroom-auth-service-all.jar

# TODO add user and group, chown copied files to user:group
