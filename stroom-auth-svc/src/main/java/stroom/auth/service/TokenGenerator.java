package stroom.auth.service;

import jersey.repackaged.com.google.common.base.Preconditions;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.config.TokenConfig;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.token.v1.TokenCreationException;

import javax.validation.constraints.NotNull;

public final class TokenGenerator {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenGenerator.class);

  private TokenConfig config;
  private Token.TokenType tokenType;
  private String user;

  private String token = "";
  private String errorMessage = "";
  private String expiresOn;

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

  public String getExpiresOn() {
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

  private final void createToken(float expirationInMinutes) throws TokenCreationException {
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

  private final JwtClaims getClaimsForUser(String user, float expirationInMinutes) throws TokenCreationException {
    JwtClaims claims = new JwtClaims();
    claims.setExpirationTimeMinutesInTheFuture(expirationInMinutes);
    claims.setSubject(user);
    claims.setIssuer(this.config.getJwsIssuer());
    try {
      this.expiresOn = claims.getExpirationTime().toString();
    } catch (MalformedClaimException e) {
      errorMessage = "Bad date format for expiration time!";
      LOGGER.error(errorMessage, e);
      throw new TokenCreationException(e);
    }
    return claims;
  }

}
