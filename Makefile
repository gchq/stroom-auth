.PHONY: swagger, config, snapshots

swagger:
	./gradlew generateSwaggerDocumentation generateSwaggerApi

config:
	cd stroom-auth-svc && ./config.yml.sh

snapshots:
	./docker.sh build ui dev-SNAPSHOT
	./docker.sh build service dev-SNAPSHOT

build:
	./gradlew clean build

no-test:
	./gradlew clean build -x test -x integrationTest
