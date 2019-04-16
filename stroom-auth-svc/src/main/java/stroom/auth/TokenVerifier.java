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

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.PublicJsonWebKey;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.config.TokenConfig;
import stroom.auth.daos.JwkDao;
import stroom.auth.daos.TokenDao;
import stroom.auth.resources.token.v1.Token;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Singleton
public class TokenVerifier {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenDao.class);

    @Inject private TokenConfig tokenConfig;
    @Inject private TokenDao tokenDao;
    @Inject private JwkDao jwkDao;

    private JwtConsumer consumer;
    private PublicJsonWebKey jwk;

    @Inject
    public void init() throws NoSuchAlgorithmException, JoseException {
        jwk = jwkDao.readJwk();

        String jwkPublicOnly = jwk.toJson(JsonWebKey.OutputControlLevel.PUBLIC_ONLY);
        String jwkPrivateOnly = jwk.toJson(JsonWebKey.OutputControlLevel.INCLUDE_PRIVATE);

        JwtConsumerBuilder builder = new JwtConsumerBuilder()
                .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
                .setRequireSubject() // the JWT must have a subject claim
                .setVerificationKey(jwk.getPublicKey()) // verify the signature with the public key
                .setJwsAlgorithmConstraints( // only allow the expected signature algorithm(s) in the given context
                        new AlgorithmConstraints(AlgorithmConstraints.ConstraintType.WHITELIST, // which is only RS256 here
                                AlgorithmIdentifiers.RSA_USING_SHA256))
                .setRelaxVerificationKeyValidation() // relaxes key length requirement
                .setExpectedIssuer(tokenConfig.getJwsIssuer());

        if (tokenConfig.isRequireExpirationTime()) {
            builder = builder.setRequireExpirationTime();
        }

        consumer = builder.build();
    }

    public Optional<String> verifyToken(String token) {
        try {
            final JwtClaims claims = consumer.processToClaims(token);
            claims.getSubject();
        } catch (InvalidJwtException | MalformedClaimException e) {
            LOGGER.warn("There was an issue with a token!", e);
            return Optional.empty();
        }

        Optional<Token> tokenRecord = tokenDao.readByToken(token);
        if (!tokenRecord.isPresent()) {
            LOGGER.warn("I tried to verify a token but that token doesn't exist.");
            return Optional.empty();
        }

        if (!tokenRecord.get().isEnabled()) {
            LOGGER.warn("Someone tried to verify a token that is not enabled.");
            return Optional.empty();
        }
        LOGGER.debug("Looks like this token is fine.");
        return Optional.of(tokenRecord.get().getUserEmail());
    }

    public JwtConsumer getJwtConsumer(){
        return this.consumer;
    }

    public PublicJsonWebKey getJwk() {
        return jwk;
    }
}
