package stroom.auth.service;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;

public final class Module extends AbstractModule {
    private Config config;

    public Module(Config config) {
        this.config = config;
    }

    protected void configure() {
        this.bind(TokenGenerator.class);
    }

    @Provides
    public Config getConfig() {
        return config;
    }
}
