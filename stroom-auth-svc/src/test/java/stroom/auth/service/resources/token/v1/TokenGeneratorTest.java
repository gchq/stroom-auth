package stroom.auth.service.resources.token.v1;

import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.junit.Test;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.TokenGenerator;
import stroom.auth.config.TokenConfig;
import stroom.auth.exceptions.TokenCreationException;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenGeneratorTest {

    @Test
    public void createSimpleToken() throws TokenCreationException, InvalidJwtException, MalformedClaimException {
        TokenConfig tokenConfig = new TokenConfig();
        tokenConfig.setMinutesUntilExpirationForApiToken(-1);
        tokenConfig.setMinutesUntilExpirationForEmailResetToken(-1);
        tokenConfig.setMinutesUntilExpirationForUserToken(-1);
        tokenConfig.setJwsIssuer("stroom");
        tokenConfig.setJwsSecret("CHANGE_ME");
        tokenConfig.setRequireExpirationTime(false);
        TokenGenerator tokenGenerator = new TokenGenerator(
                Token.TokenType.API,
                "admin",
                tokenConfig);

        tokenGenerator.createTokenWithoutExpiration();
        String token = tokenGenerator.getToken();
        assertThat(token).isNotEmpty();

        JwtConsumer consumer = new JwtConsumerBuilder()
                .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
//                .setRequireExpirationTime() // the JWT must have an expiration time
                .setRequireSubject() // the JWT must have a subject claim
                .setVerificationKey(new HmacKey(tokenConfig.getJwsSecretAsBytes())) // verify the signature with the public key
                .setRelaxVerificationKeyValidation() // relaxes key length requirement
                .setExpectedIssuer(tokenConfig.getJwsIssuer())
                .build();
        JwtClaims jwtClaims = consumer.processToClaims(token);
        assertThat(jwtClaims.getExpirationTime()).isNull();
    }
}
