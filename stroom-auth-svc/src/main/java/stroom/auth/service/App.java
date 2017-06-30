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
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import stroom.auth.service.resources.AuthenticationResource;
import stroom.auth.service.resources.UserResource;
import stroom.auth.service.security.AuthenticationFilter;
import stroom.auth.service.security.ServiceUser;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration.Dynamic;
import javax.sql.DataSource;
import java.util.EnumSet;

public final class App extends Application<Config>  {
    private Injector injector;

    public final void main(@NotNull String[] args) throws Exception {
        new App().run(args);
    }

    private final JooqBundle jooqBundle = new JooqBundle<Config>() {
        @NotNull
        public DataSourceFactory getDataSourceFactory(@NotNull Config configuration) {
            return configuration.getDataSourceFactory();
        }

        @NotNull
        public JooqFactory getJooqFactory(@NotNull Config configuration) {
            return configuration.getJooqFactory();
        }

    };

    private final FlywayBundle flywayBundle = new FlywayBundle<Config>() {
        @NotNull
        public DataSourceFactory getDataSourceFactory(@NotNull Config config) {
            return config.getDataSourceFactory();
        }


        @NotNull
        public FlywayFactory getFlywayFactory(@NotNull Config config) {
            return config.getFlywayFactory();
        }
    };

    @Override
    public void run(@NotNull Config config, @NotNull Environment environment) throws Exception {
        configureAuthentication(config, environment);
//        environment.lifecycle().addServerLifecycleListener((ServerLifecycleListener) null.INSTANCE);
        this.injector = Guice.createInjector(new stroom.auth.service.Module());

        TokenGenerator tokenGenerator = injector.getInstance(TokenGenerator.class);
        environment.jersey().register(new AuthenticationResource(tokenGenerator, config));
        environment.jersey().register(new UserResource(config));
        configureCors(environment);
        migrate(config, environment);
    }


    public void initialize(@Nullable Bootstrap bootstrap) {
        // This allows us to use templating in the YAML configuration.
        bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
                bootstrap.getConfigurationSourceProvider(),
                new EnvironmentVariableSubstitutor(false)));
        bootstrap.addBundle(this.jooqBundle);
        bootstrap.addBundle(this.flywayBundle);
    }

    private static final void configureAuthentication(Config config, Environment environment) {
        environment.jersey().register(new AuthDynamicFeature(AuthenticationFilter.get(config)));
        environment.jersey().register(new Binder(ServiceUser.class));
        environment.jersey().register(RolesAllowedDynamicFeature.class);
    }

    private static final void configureCors(Environment environment) {
        Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, new String[]{"/*"});
        cors.setInitParameter("allowedMethods", "GET,PUT,POST,DELETE,OPTIONS");
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("Access-Control-Allow-Origin", "*");
        cors.setInitParameter("allowedHeaders", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
        cors.setInitParameter("allowCredentials", "true");
    }

    private static final void migrate(Config config, Environment environment) {
        ManagedDataSource dataSource = config.getDataSourceFactory().build(environment.metrics(), "flywayDataSource");
        Flyway flyway = config.getFlywayFactory().build((DataSource) dataSource);
        flyway.migrate();
    }
}


