package stroom.security.impl;

import io.dropwizard.client.JerseyClientBuilder;
import io.dropwizard.setup.Environment;
import stroom.auth.config.Config;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.client.Client;

@Singleton
public class JerseyClientFactory {
    private final Client client;

    @Inject
    JerseyClientFactory(final Environment environment, final Config config) {
        // Create a jersey client for comms.
        client = new JerseyClientBuilder(environment).using(config.getJerseyClientConfiguration())
                .build(getClass().getSimpleName());
    }

    public Client create() {
        return client;
    }
}
