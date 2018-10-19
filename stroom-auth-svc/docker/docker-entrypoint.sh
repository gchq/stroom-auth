#!/bin/sh
set -e

# Re-set permission to the `auth` user if current user is root
# This avoids permission denied if the data volume is mounted by root
if [ "$(id -u)" = '0' ]; then
    chown -R auth:auth .

    #runs all args as user auth, rather than as root
    exec gosu auth "$@"
fi

exec "$@"
