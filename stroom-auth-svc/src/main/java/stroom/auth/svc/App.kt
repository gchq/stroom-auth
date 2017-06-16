/*
 * Copyright 2017 Crown Copyright
 *
 * This file is part of Stroom-Stats.
 *
 * Stroom-Stats is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Stroom-Stats is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Stroom-Stats.  If not, see <http://www.gnu.org/licenses/>.
 */

package stroom.auth.svc

import com.bendb.dropwizard.jooq.JooqBundle
import com.bendb.dropwizard.jooq.JooqFactory
import com.google.inject.Guice
import com.google.inject.Injector
import io.dropwizard.Application
import io.dropwizard.auth.AuthDynamicFeature
import io.dropwizard.auth.AuthValueFactoryProvider
import io.dropwizard.configuration.EnvironmentVariableSubstitutor
import io.dropwizard.configuration.SubstitutingSourceProvider
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import org.eclipse.jetty.servlets.CrossOriginFilter
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import stroom.auth.svc.resource.AuthenticationResource
import stroom.auth.svc.resource.UserResource
import stroom.auth.svc.security.AuthenticationFilter
import stroom.auth.svc.security.User
import javax.servlet.DispatcherType
import java.util.EnumSet

class App : Application<Config>() {
    private var injector: Injector? = null

    private val jooqBundle = object : JooqBundle<Config>() {
        override fun getDataSourceFactory(configuration: Config): DataSourceFactory {
            return configuration.dataSourceFactory
        }

        override fun getJooqFactory(configuration: Config): JooqFactory {
            return configuration.jooqFactory
        }
    }

    @Throws(Exception::class)
    override fun run(config: Config, environment: Environment) {
        configureAuthentication(config, environment)

        injector = Guice.createInjector(Module())
        val tokenGenerator = injector!!.getInstance(TokenGenerator::class.java)
        environment.jersey().register(AuthenticationResource(tokenGenerator, config))
        environment.jersey().register(UserResource(config))

        configureCors(environment)
    }

    override fun initialize(bootstrap: Bootstrap<Config>?) {
        // This allows us to use templating in the YAML configuration.
        bootstrap!!.configurationSourceProvider = SubstitutingSourceProvider(
                bootstrap.configurationSourceProvider,
                EnvironmentVariableSubstitutor(false))
        bootstrap.addBundle(jooqBundle)
    }

    companion object {
        @Throws(Exception::class)
        @JvmStatic fun main(args: Array<String>) {
            App().run(*args)
        }
    }
}

private fun configureAuthentication(config: Config, environment: Environment) {
    environment.jersey().register(AuthDynamicFeature(AuthenticationFilter.get(config)))
    environment.jersey().register(AuthValueFactoryProvider.Binder(User::class.java))
    environment.jersey().register(RolesAllowedDynamicFeature::class.java)
}

private fun configureCors(environment: Environment){
    val cors = environment.servlets().addFilter("CORS", CrossOriginFilter::class.java)
    cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType::class.java), true, "/*")
    cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS")
    cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*")
    cors.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*")
    cors.setInitParameter("allowedHeaders", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin")
    cors.setInitParameter("allowCredentials", "true")
}