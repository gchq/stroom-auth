package stroom.auth.service.security;

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.PublicJsonWebKey;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;
import org.junit.Ignore;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.fail;

@Ignore
public class KeyGenerator {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(KeyGenerator.class);
    RsaJsonWebKey rsaJwk = RsaJwkGenerator.generateJwk(2048);

    public KeyGenerator() throws JoseException {}

    @Test
    public void generateRsaKeys() throws JoseException {
        String jwt = sign();

        verify(jwt);

        LOGGER.info(getPrivate());
        LOGGER.info(getPublic());
    }

    private void verify(String jwt) throws JoseException {
        PublicJsonWebKey publicJwk = PublicJsonWebKey.Factory.newPublicJwk(getPublic());
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                .setRequireExpirationTime() // the JWT must have an expiration time
                .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
                .setRequireSubject() // the JWT must have a subject claim
                .setExpectedIssuer("stroom") // whom the JWT needs to have been issued by
                .setExpectedAudience("Audience") // to whom the JWT is intended for
                .setVerificationKey(publicJwk.getPublicKey()) // verify the signature with the public key
                .setJwsAlgorithmConstraints( // only allow the expected signature algorithm(s) in the given context
                        new AlgorithmConstraints(AlgorithmConstraints.ConstraintType.WHITELIST, // which is only RS256 here
                                AlgorithmIdentifiers.RSA_USING_SHA256))
                .build(); // create the JwtConsumer instance
        try
        {
            //  Validate the JWT and process it to the Claims
            JwtClaims jwtClaims = jwtConsumer.processToClaims(jwt);
            System.out.println("JWT validation succeeded! " + jwtClaims);
        }
        catch (InvalidJwtException e) {
            System.out.println("Invalid JWT! " + e);
            fail();
        }
    }

    private String sign() throws JoseException {
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(getSomeClaimsForTesting().toJson());
        PublicJsonWebKey privateJwk = PublicJsonWebKey.Factory.newPublicJwk(getPrivate());
        jws.setKey(privateJwk.getPrivateKey());
        jws.setKeyIdHeaderValue(privateJwk.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);
        String jwt = jws.getCompactSerialization();

        return jwt;
    }

    private String getPrivate(){
        return rsaJwk.toJson(JsonWebKey.OutputControlLevel.INCLUDE_PRIVATE);
    }

    private String getPublic() {
        return rsaJwk.toJson(JsonWebKey.OutputControlLevel.PUBLIC_ONLY);
    }

    private JwtClaims getSomeClaimsForTesting(){
        // Create the Claims, which will be the content of the JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer("stroom");  // who creates the token and signs it
        claims.setAudience("Audience"); // to whom the token is intended to be sent
        claims.setExpirationTimeMinutesInTheFuture(10); // time when the token will expire (10 minutes from now)
        claims.setGeneratedJwtId(); // a unique identifier for the token
        claims.setIssuedAtToNow();  // when the token was issued/created (now)
        claims.setNotBeforeMinutesInThePast(2); // time before which the token is not yet valid (2 minutes ago)
        claims.setSubject("subject"); // the subject/principal is whom the token is about
        claims.setClaim("email","mail@example.com"); // additional claims/attributes about the subject can be added
        List<String> groups = Arrays.asList("group-one", "other-group", "group-three");
        claims.setStringListClaim("groups", groups); // multi-valued claims work too and will end up as a JSON array
        return claims;
    }
}
