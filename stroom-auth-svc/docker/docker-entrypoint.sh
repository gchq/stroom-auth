#!/bin/sh
set -e

# Re-set permission to the `auth` user if current user is root
# This avoids permission denied if the data volume is mounted by root
if [ "$(id -u)" = '0' ]; then
    . /stroom-auth-service/add_container_identity_headers.sh /stroom-auth-service/logs/extra_headers.txt
    chown -R auth:auth .

    # This is a bit of a cludge to get round "Text file in use" errors
    # See: https://github.com/moby/moby/issues/9547
    # sync ensures all disk writes are persisted
    sync

    echo "Switching to user 'auth'"
    #su-exec is the alpine equivalent of gosu
    #runs all args as user proxy, rather than as root
    exec su-exec auth "$@"
fi

exec "$@"
