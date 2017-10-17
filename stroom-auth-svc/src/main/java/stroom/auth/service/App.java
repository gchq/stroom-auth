/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service;

import com.bendb.dropwizard.jooq.JooqBundle;
import com.bendb.dropwizard.jooq.JooqFactory;
import com.google.inject.Guice;
import com.google.inject.Injector;
import io.dropwizard.Application;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider.Binder;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.db.ManagedDataSource;
import io.dropwizard.flyway.FlywayBundle;
import io.dropwizard.flyway.FlywayFactory;
import io.dropwizard.jersey.sessions.SessionFactoryProvider;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.flywaydb.core.Flyway;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jooq.Configuration;
import stroom.auth.config.Config;
import stroom.auth.exceptions.mappers.BadRequestExceptionMapper;
import stroom.auth.exceptions.mappers.TokenCreationExceptionMapper;
import stroom.auth.exceptions.mappers.UnsupportedFilterExceptionMapper;
import stroom.auth.resources.authentication.v1.AuthenticationResource;
import stroom.auth.exceptions.mappers.UnauthorisedExceptionMapper;
import stroom.auth.resources.session.v1.SessionResource;
import stroom.auth.resources.token.v1.TokenResource;
import stroom.auth.resources.user.v1.UserResource;
import stroom.auth.service.security.AuthenticationFilter;
import stroom.auth.service.security.ServiceUser;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration.Dynamic;
import java.util.EnumSet;

public final class App extends Application<Config> {
  private Injector injector;

  public static void main(String[] args) throws Exception {
    new App().run(args);
  }

  private final JooqBundle jooqBundle = new JooqBundle<Config>() {
    public DataSourceFactory getDataSourceFactory(Config configuration) {
      return configuration.getDataSourceFactory();
    }

    public JooqFactory getJooqFactory(Config configuration) {
      return configuration.getJooqFactory();
    }

  };

  private final FlywayBundle flywayBundle = new FlywayBundle<Config>() {
    public DataSourceFactory getDataSourceFactory(Config config) {
      return config.getDataSourceFactory();
    }


    public FlywayFactory getFlywayFactory(Config config) {
      return config.getFlywayFactory();
    }
  };

  @Override
  public void run(Config config, Environment environment) throws Exception {
    configureAuthentication(config, environment);
    Configuration jooqConfig = this.jooqBundle.getConfiguration();
    injector = Guice.createInjector(new stroom.auth.service.Module(config, jooqConfig));
    registerResources(environment);
    registerExceptionMappers(environment);
    configureSessionHandling(environment);
    configureCors(environment);
    migrate(config, environment);
  }

  private static void configureSessionHandling(Environment environment) {
    environment.servlets().setSessionHandler(new SessionHandler());
    environment.jersey().register(SessionFactoryProvider.class);
  }


  public void initialize(Bootstrap bootstrap) {
    // This allows us to use templating in the YAML configuration.
    bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
        bootstrap.getConfigurationSourceProvider(),
        new EnvironmentVariableSubstitutor(false)));
    bootstrap.addBundle(this.jooqBundle);
    bootstrap.addBundle(this.flywayBundle);
  }

  private void registerResources(Environment environment) {
    environment.jersey().register(injector.getInstance(AuthenticationResource.class));
    environment.jersey().register(injector.getInstance(UserResource.class));
    environment.jersey().register(injector.getInstance(TokenResource.class));
    environment.jersey().register(injector.getInstance(SessionResource.class));
  }

  private void registerExceptionMappers(Environment environment) {
    environment.jersey().register(injector.getInstance(UnauthorisedExceptionMapper.class));
    environment.jersey().register(injector.getInstance(BadRequestExceptionMapper.class));
    environment.jersey().register(injector.getInstance(TokenCreationExceptionMapper.class));
    environment.jersey().register(injector.getInstance(UnsupportedFilterExceptionMapper.class));
  }

  private static final void configureAuthentication(Config config, Environment environment) {
    environment.jersey().register(new AuthDynamicFeature(AuthenticationFilter.get(config.getTokenConfig())));
    environment.jersey().register(new Binder(ServiceUser.class));
    environment.jersey().register(RolesAllowedDynamicFeature.class);
  }

  private static final void configureCors(Environment environment) {
    Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
    cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, new String[]{"/*"});
    cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS");
    cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
    cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "*");
  }

  private static final void migrate(Config config, Environment environment) {
    ManagedDataSource dataSource = config.getDataSourceFactory().build(environment.metrics(), "flywayDataSource");
    Flyway flyway = config.getFlywayFactory().build(dataSource);
    flyway.migrate();
  }
}


