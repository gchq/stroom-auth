package stroom.auth.service.config;

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
    private int jwsExpirationTimeInMinutesInTheFuture;

    @Valid
    @NotNull
    @JsonProperty
    private String jwsIssuer = "stroom";

    @Valid
    @NotNull
    @JsonProperty
    private String jwsSecret = "CHANGE_ME";

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

    public final float getJwsExpirationTimeInMinutesInTheFuture() {
        return this.jwsExpirationTimeInMinutesInTheFuture;
    }

    public final String getJwsIssuer() {
        return this.jwsIssuer;
    }

    public final String getJwsSecret() {
        return this.jwsSecret;
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

    private final Integer getPort() {
        DefaultServerFactory serverFactory = (DefaultServerFactory) this.getServerFactory();
        Integer port = serverFactory.getApplicationConnectors().stream()
                .filter( connectorFactory -> connectorFactory instanceof HttpConnectorFactory)
                .map(connectorFactory -> (HttpConnectorFactory)connectorFactory)
                .map(httpConnectorFactory -> httpConnectorFactory.getPort())
                .findFirst()
                .get();
        return port;
    }

    public final byte[] jwsSecretAsBytes() {
        return jwsSecret.getBytes();
    }

    public Integer getFailedLoginLockThreshold() {
        return this.failedLoginLockThreshold;
    }

    public AuthorisationServiceConfig getAuthorisationServiceConfig() {
        return authorisationServiceConfig;
    }
}
