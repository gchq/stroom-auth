.PHONY: swagger, config
swagger:
	./gradlew generateSwaggerDocumentation generateSwaggerApi

config:
	cd stroom-auth-svc && ./config.yml.sh