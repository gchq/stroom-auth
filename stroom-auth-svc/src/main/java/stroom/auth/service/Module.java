package stroom.auth.service;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import stroom.auth.service.config.Config;
import stroom.auth.service.resources.user.v1.UserResource;

public final class Module extends AbstractModule {
    private Config config;

    public Module(Config config) {
        this.config = config;
    }

    protected void configure() {
        bind(TokenGenerator.class);
        bind(UserResource.class);
        bind(AuthorisationServiceClient.class);
    }

    @Provides
    public Config getConfig() {
        return config;
    }
}
