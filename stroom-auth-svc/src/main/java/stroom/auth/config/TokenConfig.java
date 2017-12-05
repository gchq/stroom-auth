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

package stroom.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.jose4j.jwk.PublicJsonWebKey;
import org.jose4j.lang.JoseException;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.nio.charset.Charset;

public class TokenConfig {

    @Valid
    @NotNull
    @JsonProperty
    private int minutesUntilExpirationForUserToken;

    @Valid
    @NotNull
    @JsonProperty
    private int minutesUntilExpirationForApiToken;

    @Valid
    @NotNull
    @JsonProperty
    private int minutesUntilExpirationForEmailResetToken;

    @Valid
    @NotNull
    @JsonProperty
    private String jwsIssuer = "stroom";

    @Valid
    @NotNull
    @JsonProperty
    private String jwsSecret;

    @Valid
    @NotNull
    @JsonProperty
    private boolean requireExpirationTime = true;

    @Valid
    @NotNull
    @JsonProperty
    private String algorithm;

    public final byte[] getJwsSecretAsBytes() {
        return jwsSecret.getBytes(Charset.defaultCharset());
    }

    public int getMinutesUntilExpirationForUserToken() {
        return minutesUntilExpirationForUserToken;
    }

    public void setMinutesUntilExpirationForUserToken(int minutesUntilExpirationForUserToken) {
        this.minutesUntilExpirationForUserToken = minutesUntilExpirationForUserToken;
    }

    public int getMinutesUntilExpirationForApiToken() {
        return minutesUntilExpirationForApiToken;
    }

    public void setMinutesUntilExpirationForApiToken(int minutesUntilExpirationForApiToken) {
        this.minutesUntilExpirationForApiToken = minutesUntilExpirationForApiToken;
    }

    public int getMinutesUntilExpirationForEmailResetToken() {
        return minutesUntilExpirationForEmailResetToken;
    }

    public void setMinutesUntilExpirationForEmailResetToken(int minutesUntilExpirationForEmailResetToken) {
        this.minutesUntilExpirationForEmailResetToken = minutesUntilExpirationForEmailResetToken;
    }

    public String getJwsIssuer() {
        return jwsIssuer;
    }

    public void setJwsIssuer(String jwsIssuer) {
        this.jwsIssuer = jwsIssuer;
    }

    public String getJwsSecret() {
        return this.jwsSecret;
    }

    public void setJwsSecret(String jwsSecret) {
        this.jwsSecret = jwsSecret;
    }


    public boolean isRequireExpirationTime() {
        return requireExpirationTime;
    }

    public void setRequireExpirationTime(boolean requireExpirationTime) {
        this.requireExpirationTime = requireExpirationTime;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public PublicJsonWebKey getJwk() {
        PublicJsonWebKey jwk = null;
        try {
            jwk = PublicJsonWebKey.Factory.newPublicJwk(this.getJwsSecret());
        } catch (JoseException e) {
            throw new RuntimeException("I was unable to create a PublicKey instance from the secret! " +
                    "Please check the secret is correctly configured, i.e. it is valid JWK and serialised as JSON");
        }
        return jwk;
    }
}
