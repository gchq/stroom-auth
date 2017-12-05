package stroom.auth.service.resources.token.v1;

import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.junit.Test;
import stroom.auth.TokenGenerator;
import stroom.auth.config.TokenConfig;
import stroom.auth.exceptions.TokenCreationException;
import stroom.auth.resources.token.v1.Token;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenGeneratorTest {

    @Test
    public void createSimpleToken() throws TokenCreationException, InvalidJwtException, MalformedClaimException {
        TokenConfig tokenConfig = new TokenConfig();
        tokenConfig.setMinutesUntilExpirationForApiToken(-1);
        tokenConfig.setMinutesUntilExpirationForEmailResetToken(-1);
        tokenConfig.setMinutesUntilExpirationForUserToken(-1);
        tokenConfig.setJwsIssuer("stroom");
        tokenConfig.setJwsSecret("{\"kty\":\"RSA\",\"n\":\"3O_2TMCoiUyd-WekiqO1G_Kq2lNgWvJMQH7XL6AYDa2XJQKoDarYwKJUlqvhZV0SP_hoBJqmIIGfiziaSHeftjxMIoX2AIRL-l1hHswMC6DbtX1WSHcuvEwgxMObku1LRyjLmCeboRxgTAgKBneY2Ruz-dWJha7dupH0ub5jkWgRKa6CTuZqbyxq3qn1N2JqJzm_b6kJpbA1hfqq5f0xTy7QuMyl88sOmk71CRslWzteH_jQfUEyYfKhauUrwTn5pVYSIwZssOc7tbe2IClCZLGF6E4Bkg72xvg6SIRXELQU0EXhy2aP-ycsAxGrkmifs3_I8oJFQ_YhxH4k43i19Q\",\"e\":\"AQAB\",\"d\":\"clZM5JOfpM5dwsB8SrNF-tyuxqX3a5mRFJ-PxTnYuNtpKOIjDk-oNKjNldwFnWt5Eln_msJdztzGMEpuraoaoTi7PfKNyN6uYzcIF-QJJ8traJUgngfvy8qp-qowTO040-6szmVRCSOiQja22XnzRAguL9DuhpxkazU1rRp2dLyr1riKz2pKJOQdGLSCOT9IW1epphvmQaKIlcbjTO5yTXu85aLhmJ6_Oj6_HzC2QzHnAwi6TQ6rZfuYiq99nm5QBlGbM3q-6FMaQu7bGqA9CQ10TyHp7ksZK6KyIFOuI3E9q6w3FiLaTPeiyTPI3S6Y08SJo0hb9gGP3PwYHIduUQ\",\"p\":\"_eMGWwsUIjT_9Tcrrp-zM9spHFr-6eOZPVy7KUA4BOGfxCrf8MRqBdtrAQ7daNEiwm3b8o6VFd8i7wr6XZ4v-wv4x_fHeLh4gkqv17o7YtdiX3zBb5QSnW4yLhcTxabxH9GoZhR6XXe0JrGedHE7dXqiyNKmsH1-zwKZ2yNHRYs\",\"q\":\"3sa6vYB4JYMpVbRnRwCAIVqlzzVZ3s2WRfbUvRE2EW_HEV_xi1enJEYEGPLI8SKQ0Si9cwnOzH8irRqgMqmbOxl863KbDTAfPSGnuKWMmK5Z0-40T3JmNQE_UQnvRChmaM4cuQRpV0I_6DyZF0y3u23PZ0MyoY8VANOdays6Yn8\",\"dp\":\"_dIqWHsK9efmvVEa6snebsl8oEyY7VwNp7s9olABsV-gSo5StHKpTJHAuJ4T3Oa4yYjri-PgSK18T1-6Tj4H2gRuA_1D_vzt_dSNWC9nj7mlL7GZ8eMneRziLhIEQmZUSmtg4C046Jj0Ensg32kU-K5ScFOpMmlEjdEb4Gm0p2E\",\"dq\":\"b54aikAH8qOY3jwZUtXJXOzSDtOoR52yITPeuywYbvwWPXpYx3wPXnlGLEnYrBipfmJvKWhMmOFKOnkQstGP2TiYAk_Vp_HodPSb2EP6AbW5hBnhU7z5wKzzUGMt4nRrey9p7LltHi8vXeieu7HQjLQkKpTclV3fJB7izINIKXk\",\"qi\":\"dVAmm8DiOgCR4ZevOQfe7cr_jt1alzGk6MndwuyEPPRvMHOS9Ndf26mgw0FY916prEGoCBpj3m6gfWdZAhKpOzIrOLp0TJ6wNoiyDvGBYvfNfbUBXRskt6lPQ5NBc2dvZIFB7njXWQeEgcH5YYkkxoCzPil1amxIom0Li7W8_mk\"}");
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
                .setVerificationKey(tokenConfig.getJwk().getPublicKey()) // verify the signature with the public key
                .setRelaxVerificationKeyValidation() // relaxes key length requirement
                .setExpectedIssuer(tokenConfig.getJwsIssuer())
                .build();
        JwtClaims jwtClaims = consumer.processToClaims(token);
        assertThat(jwtClaims.getExpirationTime()).isNull();
    }
}
