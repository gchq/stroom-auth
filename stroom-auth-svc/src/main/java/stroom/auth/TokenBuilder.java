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

import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.NumericDate;
import org.jose4j.lang.JoseException;
import stroom.auth.resources.token.v1.Token.TokenType;

import java.security.PrivateKey;
import java.util.Optional;

public class TokenBuilder {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TokenBuilder.class);

    private TokenType tokenType;
    private Optional<Integer> expirationInMinutes = Optional.empty();
    private String issuer;
    private byte[] secret;
    private String algorithm = "RS256";

    private String subject;
    private Optional<String> nonce = Optional.empty();
    private Optional<String> state = Optional.empty();
    private PrivateKey privateVerificationKey;
    private String authSessionId;

    public TokenBuilder subject(String subject) {
        this.subject = subject;
        return this;
    }

    public TokenBuilder tokenType(TokenType tokenType) {
        this.tokenType = tokenType;
        return this;
    }

    public TokenBuilder expirationInMinutes(int expirationInMinutes) {
        this.expirationInMinutes = Optional.of(expirationInMinutes);
        return this;
    }

    public TokenBuilder issuer(String issuer) {
        this.issuer = issuer;
        return this;
    }

    public TokenBuilder secret(byte[] secret) {
        this.secret = secret;
        return this;
    }

    public TokenBuilder privateVerificationKey(PrivateKey privateVerificationKey){
        this.privateVerificationKey = privateVerificationKey;
        return this;
    }

    public TokenBuilder nonce(String nonce) {
        this.nonce = Optional.of(nonce);
        return this;
    }

    public TokenBuilder state(String state) {
        this.state = Optional.of(state);
        return this;
    }

    public TokenBuilder algorithm(String algorithm) {
        this.algorithm = algorithm;
        return this;
    }

    /**
     * The authSessionId is needed for federated logout. It allows a back-channel (API) logout request from an RP
     * to the IP to contain the authSessionId. The IP then requests logout from all known RPs, passing this on.
     * If the other RPs havea map of authSessionIds to it's own sessionIds then it will be able to log the user out.
     */
    public TokenBuilder authSessionId(String authSessionId) {
        this.authSessionId = authSessionId;
        return this;
    }

    public String build() {
        JwtClaims claims = new JwtClaims();
        expirationInMinutes.ifPresent(claims::setExpirationTimeMinutesInTheFuture);
        claims.setSubject(subject);
        claims.setIssuer(issuer);
        claims.setStringClaim("authSessionId", authSessionId);
        nonce.ifPresent(nonce -> claims.setClaim("nonce", nonce));
        state.ifPresent(state -> claims.setClaim("state", state));

        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());
        jws.setAlgorithmHeaderValue(this.algorithm);
        jws.setKey(this.privateVerificationKey);
        jws.setDoKeyValidation(false);

        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            throw new RuntimeException(e);
        }
    }

    public NumericDate expiresOn() {
        NumericDate numericDate = NumericDate.now();
        float secondsOffset = expirationInMinutes.get() * 60;
        numericDate.addSeconds((long)secondsOffset);
        return numericDate;
    }

}
