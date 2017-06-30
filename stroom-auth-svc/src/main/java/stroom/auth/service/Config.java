package stroom.auth.service;

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
    private DataSourceFactory dataSourceFactory = new DataSourceFactory();

    @Valid
    @NotNull
    private FlywayFactory flywayFactory = new FlywayFactory();

    @Valid
    @NotNull
    private JooqFactory jooqFactory = new JooqFactory();

    @Valid
    @NotNull
    private float jwsExpirationTimeInMinutesInTheFuture = 5.0F;

    @Valid
    @NotNull
    private String jwsIssuer = "stroom";

    @Valid
    @NotNull
    private String jwsSecret = "CHANGE_ME";

    @Valid
    @NotNull
    private String certificateDnPattern = "CN=[^ ]+ [^ ]+ (?([a-zA-Z0-9]+))?";

    @Valid
    @NotNull
    private String loginUrl = "";

    @Valid
    @NotNull
    private String stroomUrl = "";

    @Valid
    @NotNull
    private String advertisedHost = "";

    @Nullable
    private Integer httpPort;

    @Nullable
    private Integer httpsPort;

    @JsonProperty("database")
    @NotNull
    public final DataSourceFactory getDataSourceFactory() {
        return this.dataSourceFactory;
    }

    public final void setDataSourceFactory(@NotNull DataSourceFactory dataSourceFactory) {
        this.dataSourceFactory = dataSourceFactory;
    }

    @JsonProperty("flyway")
    @NotNull
    public final FlywayFactory getFlywayFactory() {
        return this.flywayFactory;
    }

    public final void setFlywayFactory(@NotNull FlywayFactory flywayFactory) {
        this.flywayFactory = flywayFactory;
    }

    @JsonProperty("jooq")
    @NotNull
    public final JooqFactory getJooqFactory() {
        return this.jooqFactory;
    }

    public final void setJooqFactory(@NotNull JooqFactory jooqFactory) {
        this.jooqFactory = jooqFactory;
    }

    @JsonProperty
    public final float getJwsExpirationTimeInMinutesInTheFuture() {
        return this.jwsExpirationTimeInMinutesInTheFuture;
    }

    public final void setJwsExpirationTimeInMinutesInTheFuture(float jwsExpirationTimeInMinutesInTheFuture) {
        this.jwsExpirationTimeInMinutesInTheFuture = jwsExpirationTimeInMinutesInTheFuture;
    }

    @JsonProperty
    @NotNull
    public final String getJwsIssuer() {
        return this.jwsIssuer;
    }

    public final void setJwsIssuer(@NotNull String jwsIssuer) {
        this.jwsIssuer = jwsIssuer;
    }

    @JsonProperty
    @NotNull
    public final String getJwsSecret() {
        return this.jwsSecret;
    }

    public final void setJwsSecret(@NotNull String jwsSecret) {
        this.jwsSecret = jwsSecret;
    }

    @JsonProperty
    @NotNull
    public final String getCertificateDnPattern() {
        return this.certificateDnPattern;
    }

    public final void setCertificateDnPattern(@NotNull String certificateDnPattern) {
        this.certificateDnPattern = certificateDnPattern;
    }

    @JsonProperty
    @NotNull
    public final String getLoginUrl() {
        return this.loginUrl;
    }

    public final void setLoginUrl(@NotNull String loginUrl) {
        this.loginUrl = loginUrl;
    }

    @JsonProperty
    @NotNull
    public final String getStroomUrl() {
        return this.stroomUrl;
    }

    public final void setStroomUrl(@NotNull String stroomUrl) {
        this.stroomUrl = stroomUrl;
    }

    @JsonProperty
    @NotNull
    public final String getAdvertisedHost() {
        return this.advertisedHost;
    }

    public final void setAdvertisedHost(@NotNull String advertisedHost) {
        this.advertisedHost = advertisedHost;
    }

    @Nullable
    public final Integer getHttpPort() {
        return getPort();
    }

    public final void setHttpPort(@Nullable Integer httpPort) {
        this.httpPort = httpPort;
    }

    @Nullable
    public final Integer getHttpsPort() {
        return getPort();
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

    public final void setHttpsPort(@Nullable Integer httpsPort) {
        this.httpsPort = httpsPort;
    }

    @NotNull
    public final byte[] jwsSecretAsBytes() {
        return jwsSecret.getBytes();
    }

}
