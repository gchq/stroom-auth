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

@Singleton
public class TokenBuilderFactory {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TokenBuilderFactory.class);
    private Config config;
    private TokenVerifier tokenVerifier;

    @Inject
    public TokenBuilderFactory(Config config, TokenVerifier tokenVerifier) {
        this.config = config;
        this.tokenVerifier = tokenVerifier;
    }

    public TokenBuilder newBuilder(TokenType tokenType) {
        TokenBuilder tokenBuilder = new TokenBuilder();
        switch (tokenType) {
            case API:
                tokenBuilder.expirationInMinutes(config.getTokenConfig().getMinutesUntilExpirationForApiToken());
                break;
            case USER:
                tokenBuilder.expirationInMinutes(config.getTokenConfig().getMinutesUntilExpirationForUserToken());
                break;
            case EMAIL_RESET:
                tokenBuilder.expirationInMinutes(config.getTokenConfig().getMinutesUntilExpirationForEmailResetToken());
                break;
            default:
                String errorMessage = "Unknown token type:" + tokenType.toString();
                LOGGER.error(errorMessage);
                throw new TokenCreationException(tokenType, errorMessage);
        }

        tokenBuilder
                .issuer(config.getTokenConfig().getJwsIssuer())
                .privateVerificationKey(tokenVerifier.getJwk().getPrivateKey())
                .algorithm(config.getTokenConfig().getAlgorithm())
                .tokenType(tokenType);

        return tokenBuilder;
    }
}
