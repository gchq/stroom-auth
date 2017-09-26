package stroom.auth.service.resources.token.v1;

import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.config.TokenConfig;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.Optional;

@Singleton
public class TokenVerifier {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenDao.class);

  @Inject
  private TokenConfig tokenConfig;

  @Inject
  private TokenDao tokenDao;

  private JwtConsumer consumer;

  @Inject
  public void init(){
    consumer = new JwtConsumerBuilder()
        .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
        .setRequireExpirationTime() // the JWT must have an expiration time
        .setRequireSubject() // the JWT must have a subject claim
        .setVerificationKey(new HmacKey(tokenConfig.getJwsSecretAsBytes())) // verify the signature with the public key
        .setRelaxVerificationKeyValidation() // relaxes key length requirement
        .setExpectedIssuer(tokenConfig.getJwsIssuer())
        .build();
  }

  public Optional<String> verifyToken(String token){
    try {
      final JwtClaims claims = consumer.processToClaims(token);
      claims.getSubject();
    } catch (InvalidJwtException | MalformedClaimException e) {
      LOGGER.warn("There was an issue with a token.");
      return Optional.empty();
    }

    Optional<Token> tokenRecord = tokenDao.readByToken(token);
    if(!tokenRecord.isPresent()){
      LOGGER.warn("I tried to verify a token but that token doesn't exist.");
      return Optional.empty();
    }

    if(!tokenRecord.get().isEnabled()){
      LOGGER.warn("Someone tried to verify a token that is disabled.");
      return Optional.empty();
    }

    // Looks like the token is fine
    return Optional.of(tokenRecord.get().getUser_email());
  }
}
