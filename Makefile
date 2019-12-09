.PHONY : swagger,config,snapshot,build,no-test
swagger:
	./gradlew generateSwaggerDocumentation generateSwaggerApi

config:
	cd stroom-auth-svc && ./config.yml.sh

snapshot:
	./docker.sh build local-SNAPSHOT

build:
	./gradlew clean build

no-test:
	./gradlew clean build -x test -x integrationTest
