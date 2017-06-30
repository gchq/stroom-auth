package stroom.auth.service;

import java.nio.charset.Charset;
import java.security.Key;
import javax.inject.Inject;
import javax.inject.Singleton;

import jersey.repackaged.com.google.common.base.Preconditions;
import org.jetbrains.annotations.NotNull;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;

@Singleton
public final class TokenGenerator {
    private Config config;

    @NotNull
    public final String getToken(@NotNull String user) {
        Preconditions.checkNotNull(user);
        byte[] jwsSecret = this.config.getJwsSecret().getBytes(Charset.defaultCharset());
        JwtClaims jwtClaims = getClaimsForUser(user);
        return toToken(jwsSecret, jwtClaims);
    }

    private final String toToken(byte[] key, JwtClaims claims) {
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());
        jws.setAlgorithmHeaderValue("HS256");
        jws.setKey((new HmacKey(key)));
        jws.setDoKeyValidation(false);

        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            throw new RuntimeException(e);
        }
    }

    private final JwtClaims getClaimsForUser(String user) {
        JwtClaims claims = new JwtClaims();
        claims.setExpirationTimeMinutesInTheFuture(this.config.getJwsExpirationTimeInMinutesInTheFuture());
        claims.setSubject(user);
        claims.setIssuer(this.config.getJwsIssuer());
        return claims;
    }

    @Inject
    public TokenGenerator(@NotNull Config config) {
        Preconditions.checkNotNull(config);
        this.config = config;
    }
}
