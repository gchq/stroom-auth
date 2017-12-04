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

package stroom.auth;

import jersey.repackaged.com.google.common.base.Preconditions;
import org.jose4j.jwk.PublicJsonWebKey;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.config.TokenConfig;
import stroom.auth.exceptions.TokenCreationException;
import stroom.auth.resources.token.v1.Token.TokenType;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

public final class TokenGenerator {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenGenerator.class);

    private TokenConfig config;
    private TokenType tokenType;
    private String user;

    private String token = "";
    private String errorMessage = "";
    private Timestamp expiresOn;

    public TokenGenerator(TokenType tokenType, String user, TokenConfig config) throws TokenCreationException {
        Preconditions.checkNotNull(user);
        Preconditions.checkNotNull(tokenType);
        Preconditions.checkNotNull(config);
        this.config = config;
        this.tokenType = tokenType;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Timestamp getExpiresOn() {
        return expiresOn;
    }

    public final void createToken() throws TokenCreationException {
        switch (tokenType) {
            case API:
                createToken(Optional.of(config.getMinutesUntilExpirationForApiToken()));
                break;
            case USER:
                createToken(Optional.of(config.getMinutesUntilExpirationForUserToken()));
                break;
            case EMAIL_RESET:
                createToken(Optional.of(config.getMinutesUntilExpirationForEmailResetToken()));
                break;
            default:
                errorMessage = "Unknown token type:" + tokenType.toString();
                LOGGER.error(errorMessage);
                throw new TokenCreationException(tokenType, errorMessage);
        }
    }

    public void createTokenWithoutExpiration() throws TokenCreationException {
        createToken(Optional.empty());
    }

    private void createToken(Optional<Integer> expirationInMinutes) throws TokenCreationException {
        PublicJsonWebKey jwk = this.config.getJwk();

        JwtClaims jwtClaims = getClaimsForUser(user, expirationInMinutes);

        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(jwtClaims.toJson());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);
        jws.setKey((jwk.getPrivateKey()));
        jws.setDoKeyValidation(false);

        try {
            this.token = jws.getCompactSerialization();
        } catch (JoseException e) {
            throw new RuntimeException(e);
        }
    }

    private JwtClaims getClaimsForUser(String user, Optional<Integer> expirationInMinutes) throws TokenCreationException {
        JwtClaims claims = new JwtClaims();
        expirationInMinutes.ifPresent(expirationInMins -> {
            this.expiresOn = Timestamp.valueOf(LocalDateTime.now().plusMinutes(expirationInMins));
            claims.setExpirationTimeMinutesInTheFuture(expirationInMins);
        });

        claims.setSubject(user);
        claims.setIssuer(this.config.getJwsIssuer());

        return claims;
    }

}
