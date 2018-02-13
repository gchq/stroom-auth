#!/usr/bin/env bash
# Updates jooq's classes.

./flyway.sh migrate
./gradlew -PjooqGeneration=true clean build -x test -x integrationTest
