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

import stroom.auth.config.Config;
import stroom.auth.exceptions.TokenCreationException;
import stroom.auth.resources.token.v1.Token.TokenType;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.Instant;

@Singleton
public class TokenBuilderFactory {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TokenBuilderFactory.class);

    private final Config config;
    private final JwkCache jwkCache;

    private Instant expiryDateForApiKeys;

    @Inject
    TokenBuilderFactory(final Config config, final JwkCache jwkCache) {
        this.config = config;
        this.jwkCache = jwkCache;
    }

    public TokenBuilderFactory expiryDateForApiKeys(Instant expiryDate) {
        this.expiryDateForApiKeys = expiryDate;
        return this;
    }

    public TokenBuilder newBuilder(TokenType tokenType) {
        TokenBuilder tokenBuilder = new TokenBuilder();
        switch (tokenType) {
            case API:
                if (expiryDateForApiKeys == null) {
                    expiryDateForApiKeys = Instant.now().plusSeconds(config.getTokenConfig().getMinutesUntilExpirationForUserToken() * 60);
                }
                tokenBuilder.expiryDate(expiryDateForApiKeys);
                break;
            case USER:
                Instant expiryDateForLogin = Instant.now().plusSeconds(config.getTokenConfig().getMinutesUntilExpirationForUserToken() * 60);
                tokenBuilder.expiryDate(expiryDateForLogin);
                break;
            case EMAIL_RESET:
                Instant expiryDateForReset = Instant.now().plusSeconds(config.getTokenConfig().getMinutesUntilExpirationForEmailResetToken() * 60);
                tokenBuilder.expiryDate(expiryDateForReset);
                break;
            default:
                String errorMessage = "Unknown token type:" + tokenType.toString();
                LOGGER.error(errorMessage);
                throw new TokenCreationException(tokenType, errorMessage);
        }

        tokenBuilder
                .issuer(config.getTokenConfig().getJwsIssuer())
                .privateVerificationKey(jwkCache.get().get(0).getPrivateKey())
                .algorithm(config.getTokenConfig().getAlgorithm())
                .tokenType(tokenType);

        return tokenBuilder;
    }
}
