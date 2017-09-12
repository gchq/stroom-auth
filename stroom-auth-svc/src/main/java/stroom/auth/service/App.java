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
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.flywaydb.core.Flyway;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import stroom.auth.service.config.Config;
import stroom.auth.service.resources.authentication.v1.AuthenticationResource;
import stroom.auth.service.resources.token.v1.TokenResource;
import stroom.auth.service.resources.user.v1.UserResource;
import stroom.auth.service.security.AuthenticationFilter;
import stroom.auth.service.security.ServiceUser;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration.Dynamic;
import javax.sql.DataSource;
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
    injector = Guice.createInjector(new stroom.auth.service.Module(config));
    registerResources(environment);
    configureCors(environment);
    migrate(config, environment);
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
  }

  private static final void configureAuthentication(Config config, Environment environment) {
    environment.jersey().register(new AuthDynamicFeature(AuthenticationFilter.get(config)));
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


