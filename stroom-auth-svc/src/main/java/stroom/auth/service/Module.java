package stroom.auth.service;

import com.google.inject.AbstractModule;

public final class Module extends AbstractModule {
    protected void configure() {
        this.bind(TokenGenerator.class);
    }
}
