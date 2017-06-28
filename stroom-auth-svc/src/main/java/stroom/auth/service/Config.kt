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

package stroom.auth.service

import com.bendb.dropwizard.jooq.JooqFactory
import com.fasterxml.jackson.annotation.JsonProperty
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.flyway.FlywayFactory
import io.dropwizard.jetty.HttpConnectorFactory
import io.dropwizard.jetty.HttpsConnectorFactory
import io.dropwizard.server.DefaultServerFactory
import org.apache.curator.retry.BoundedExponentialBackoffRetry
import java.nio.charset.Charset

import javax.validation.Valid
import javax.validation.constraints.NotNull

class Config : Configuration() {

    lateinit var curator: Curator

    @Valid
    @NotNull
    @get:JsonProperty("database")
    var dataSourceFactory = DataSourceFactory()

    @Valid
    @NotNull
    @get:JsonProperty("flyway")
    var flywayFactory = FlywayFactory()


    @Valid
    @NotNull
    @get:JsonProperty("jooq")
    var jooqFactory = JooqFactory()

    @Valid
    @NotNull
    @get:JsonProperty
    var jwsExpirationTimeInMinutesInTheFuture = 5f

    @Valid
    @NotNull
    @get:JsonProperty
    var jwsIssuer = "stroom"


    @Valid
    @NotNull
    @get:JsonProperty
    var jwsSecret = "CHANGE_ME"

    @Valid
    @NotNull
    @get:JsonProperty
    var certificateDnPattern = """CN=[^ ]+ [^ ]+ (?([a-zA-Z0-9]+))?"""

    @Valid
    @NotNull
    @get:JsonProperty
    var loginUrl = ""

    @Valid
    @NotNull
    @get:JsonProperty
    var stroomUrl = ""

    @Valid
    @NotNull
    @get:JsonProperty
    var advertisedHost = ""

    var httpPort: Int? = null
        get() = (serverFactory as DefaultServerFactory).applicationConnectors
                     .filterIsInstance<HttpConnectorFactory>()
                     .map { it.port }
                     .first()



    var httpsPort: Int? = null
        get() = (serverFactory as DefaultServerFactory).applicationConnectors
                    .filterIsInstance<HttpsConnectorFactory>()
                    .map { it.port }
                    .first()

    fun jwsSecretAsBytes(): ByteArray {
        return jwsSecret.toByteArray(Charset.defaultCharset())
    }

    class Curator {
        @Valid
        @NotNull
        @get:JsonProperty
        var zookeeperQuorum = ""

        @Valid
        @NotNull
        @get:JsonProperty
        var baseSleepTime = 5_000

        @Valid
        @NotNull
        @get:JsonProperty
        var maxSleepTime = 300_000

        @Valid
        @NotNull
        @get:JsonProperty
        var retryLimit = 100

        @Valid
        @NotNull
        @get:JsonProperty
        var zookeeperBasePath = ""

        var retryPolicy: BoundedExponentialBackoffRetry? = null
            get() = BoundedExponentialBackoffRetry(
                    this.baseSleepTime,
                    this.maxSleepTime,
                    this.retryLimit)
    }
}

