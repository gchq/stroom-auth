#!/usr/bin/env bash

# Exit script on any error
set -e

#Shell Colour constants for use in 'echo -e'
#e.g.  echo -e "My message ${GREEN}with just this text in green${NC}"
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Colour


NO_ARGUMENT_MESSAGE="Please supply an argument: either ${YELLOW}migrate${NC}, ${YELLOW}clean${NC}, ${YELLOW}info${NC}, ${YELLOW}validate${NC}, ${YELLOW}undo${NC}, ${YELLOW}baseline${NC} or ${YELLOW}repair${NC}."
# Check script's params
if [ $# -ne 1 ]; then
    echo -e $NO_ARGUMENT_MESSAGE
    echo -e ""
    exit 1
fi

# We should be able to do this using the Flyway Gradle plugin. There are a few issues with this:
#  1. The Flyway Gradle plugin isn't recognising the configuration in the build.gradle file.
#  2. This might be solved by upgrading from Flyway 4.x to Flyway 5.x, but the Dropwizard bundle is 4.x only, so we can't.
./gradlew -Pflyway.user=authuser -Pflyway.password=stroompassword1 -Pflyway.url=jdbc:mysql://localhost:3307/auth?useUnicode=yes&characterEncoding=UTF-8 -Pflyway.locations=filesystem:stroom-auth-svc/src/main/resources/db/migration flyway$1
