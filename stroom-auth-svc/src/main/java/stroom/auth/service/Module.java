package stroom.auth.service;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import org.jooq.Configuration;
import stroom.auth.service.config.Config;
import stroom.auth.service.config.TokenConfig;
import stroom.auth.service.resources.authentication.v1.AuthenticationResource;
import stroom.auth.service.resources.token.v1.TokenDao;
import stroom.auth.service.resources.token.v1.TokenResource;
import stroom.auth.service.resources.user.v1.UserResource;

public final class Module extends AbstractModule {
  private Config config;
  private Configuration jooqConfig;

  public Module(Config config, Configuration jooqConfig) {
    this.config = config;
    this.jooqConfig = jooqConfig;
  }

  protected void configure() {
    bind(UserResource.class);
    bind(AuthenticationResource.class);
    bind(TokenResource.class);
    bind(AuthorisationServiceClient.class);
    bind(TokenDao.class);
  }

  @Provides
  public Config getConfig() {
    return config;
  }

  @Provides
  public TokenConfig getTokenConfig() {
    return config.getTokenConfig();
  }

  @Provides
  public Configuration getJooqConfig() {
    return jooqConfig;
  }
}
