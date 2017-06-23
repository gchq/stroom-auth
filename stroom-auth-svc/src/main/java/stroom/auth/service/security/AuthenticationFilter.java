package stroom.auth.service.security;

import com.github.toastshaman.dropwizard.auth.jwt.JwtAuthFilter;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import stroom.auth.service.Config;

public class AuthenticationFilter {

  public static JwtAuthFilter<ServiceUser> get(Config config)  {
    final JwtConsumer consumer = new JwtConsumerBuilder()
        .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
        .setRequireExpirationTime() // the JWT must have an expiration time
        .setRequireSubject() // the JWT must have a subject claim
        .setVerificationKey(new HmacKey(config.jwsSecretAsBytes())) // verify the signature with the public key
        .setRelaxVerificationKeyValidation() // relaxes key length requirement
        .setExpectedIssuer("stroom")
        .build();

    return new JwtAuthFilter.Builder<ServiceUser>()
        .setJwtConsumer(consumer)
        .setRealm("realm")
        .setPrefix("Bearer")
        .setAuthenticator(new UserAuthenticator())
        .buildAuthFilter();
  }
}
