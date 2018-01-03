#!/bin/bash
# Any attempt to check this will fail because the caller (possibly a guest container)
# won't be able to talk back to the host
export ENABLE_TOKEN_REVOCATION_CHECK=false

# The Authorisation Service, which runs in the Stroom container, needs to talk back to the auth-service,
# which runs on the host. So we need to add a name to the host so it points back to us.
export STROOM_RESOURCES_ADVERTISED_HOST=`ip route get 1 | awk '{print $NF;exit}'`

# Increase the size of the heap
export JAVA_OPTS=-Xmx1024m

sudo bash -c "echo '127.0.0.1 kafka' >> /etc/hosts"
sudo bash -c "echo '127.0.0.1 hbase' >> /etc/hosts"
sudo bash -c "echo '127.0.0.1 auth-service' >> /etc/hosts"

# Get stroom-resources and start the DBs
mkdir -p ../git_work
pushd ../git_work
git clone https://github.com/gchq/stroom-resources.git
pushd stroom-resources/bin
git checkout $RESOURCES_BRANCH
# Start all the services we need to run the integration tests in stroom
nohup ./bounceIt.sh up -e -y --build kafka zookeeper stroom stroom-db stroom-stats-db stroom-auth-service-db &
popd
popd
