/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources.token.v1;

import jersey.repackaged.com.google.common.base.Preconditions;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.config.TokenConfig;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDateTime;

final class TokenGenerator {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenGenerator.class);

  private TokenConfig config;
  private Token.TokenType tokenType;
  private String user;

  private String token = "";
  private String errorMessage = "";
  private Timestamp expiresOn;

  public TokenGenerator(Token.TokenType tokenType, @NotNull String user, TokenConfig config) throws TokenCreationException {
    this.config = config;
    Preconditions.checkNotNull(user);
    Preconditions.checkNotNull(tokenType);
    Preconditions.checkNotNull(config);
    this.tokenType = tokenType;
    this.user = user;
    createToken();
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

  private final void createToken() throws TokenCreationException {
    switch(tokenType){
      case API:
        createToken(config.getMinutesUntilExpirationForApiToken());
        break;
      case USER:
        createToken(config.getMinutesUntilExpirationForUserToken());
        break;
      case EMAIL_RESET:
        createToken(config.getMinutesUntilExpirationForEmailResetToken());
        break;
      default:
        errorMessage = "Unknown token type:" + tokenType.toString();
        LOGGER.error(errorMessage);
        throw new TokenCreationException(tokenType, errorMessage);
    }
  }

  private final void createToken(long expirationInMinutes) throws TokenCreationException {
    byte[] jwsSecret = this.config.getJwsSecretAsBytes();
    JwtClaims jwtClaims = getClaimsForUser(user, expirationInMinutes);
    this.token = toToken(jwsSecret, jwtClaims);
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

  private final JwtClaims getClaimsForUser(String user, long expirationInMinutes) throws TokenCreationException {
    JwtClaims claims = new JwtClaims();
    this.expiresOn = Timestamp.valueOf(LocalDateTime.now().plusMinutes(expirationInMinutes));
    claims.setExpirationTimeMinutesInTheFuture(expirationInMinutes);
    claims.setSubject(user);
    claims.setIssuer(this.config.getJwsIssuer());
    return claims;
  }

}
