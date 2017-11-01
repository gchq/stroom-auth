/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.config;

import com.bendb.dropwizard.jooq.JooqFactory;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.flyway.FlywayFactory;
import io.dropwizard.jetty.HttpConnectorFactory;
import io.dropwizard.server.DefaultServerFactory;

import javax.annotation.Nullable;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public final class Config extends Configuration {

    @Valid
    @NotNull
    @JsonProperty("database")
    private DataSourceFactory dataSourceFactory = new DataSourceFactory();

    @Valid
    @NotNull
    @JsonProperty("flyway")
    private FlywayFactory flywayFactory = new FlywayFactory();

    @Valid
    @NotNull
    @JsonProperty("jooq")
    private JooqFactory jooqFactory = new JooqFactory();

    @Valid
    @NotNull
    @JsonProperty
    private String certificateDnPattern = "CN=[^ ]+ [^ ]+ (?([a-zA-Z0-9]+))?";

    @Valid
    @NotNull
    @JsonProperty
    private String loginUrl = "";

    @Valid
    @NotNull
    @JsonProperty
    private String stroomUrl = "";

    @Valid
    @NotNull
    @JsonProperty
    private String advertisedHost = "";

    @Nullable
    @JsonProperty
    private Integer httpPort;

    @Nullable
    @JsonProperty
    private Integer httpsPort;

    @Nullable
    @JsonProperty
    private Integer failedLoginLockThreshold = 3;

    @NotNull
    @JsonProperty
    private String resetPasswordUrl;

    @Nullable
    @JsonProperty("email")
    private EmailConfig emailConfig;

    @Nullable
    @JsonProperty("token")
    private TokenConfig tokenConfig;

    @NotNull
    @JsonProperty("authorisationService")
    private AuthorisationServiceConfig authorisationServiceConfig;

    public final DataSourceFactory getDataSourceFactory() {
        return this.dataSourceFactory;
    }

    public final FlywayFactory getFlywayFactory() {
        return this.flywayFactory;
    }

    public final JooqFactory getJooqFactory() {
        return this.jooqFactory;
    }

    public final String getCertificateDnPattern() {
        return this.certificateDnPattern;
    }

    public final String getLoginUrl() {
        return this.loginUrl;
    }

    public final String getStroomUrl() {
        return this.stroomUrl;
    }

    public final String getAdvertisedHost() {
        return this.advertisedHost;
    }

    public final Integer getHttpPort() {
        return getPort();
    }

    public final Integer getHttpsPort() {
        return getPort();
    }

    public EmailConfig getEmailConfig() {
        return emailConfig;
    }

    public String getResetPasswordUrl() {
        return resetPasswordUrl;
    }

    public Integer getFailedLoginLockThreshold() {
        return this.failedLoginLockThreshold;
    }

    public AuthorisationServiceConfig getAuthorisationServiceConfig() {
        return authorisationServiceConfig;
    }

    public TokenConfig getTokenConfig() {
        return tokenConfig;
    }

    private Integer getPort() {
        DefaultServerFactory serverFactory = (DefaultServerFactory) this.getServerFactory();
        Integer port = serverFactory.getApplicationConnectors().stream()
                .filter(connectorFactory -> connectorFactory instanceof HttpConnectorFactory)
                .map(connectorFactory -> (HttpConnectorFactory) connectorFactory)
                .map(httpConnectorFactory -> httpConnectorFactory.getPort())
                .findFirst()
                .get();
        return port;
    }
}
