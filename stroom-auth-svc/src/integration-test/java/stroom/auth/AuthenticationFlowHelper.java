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

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import stroom.auth.service.ApiClient;
import stroom.auth.service.ApiException;
import stroom.auth.service.ApiResponse;
import stroom.auth.service.api.AuthenticationApi;
import stroom.auth.service.api.model.Credentials;
import stroom.auth.service.api.model.IdTokenRequest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

public class AuthenticationFlowHelper {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(AuthenticationFlowHelper.class);

    private static final String CLIENT_ID = "integrationTestClient";

    public static String authenticateAsAdmin() {
        return authenticateAs("admin", "admin");
    }

    public static String authenticateAs(String userEmail, String password) {
        // We need to use a real-ish sort of nonce otherwise the OpenId tokens might end up being identical.
        String nonce = UUID.randomUUID().toString();
        String sessionId = sendInitialAuthenticationRequest(nonce);
        String accessCode = null;
        try {
            accessCode = performLogin(sessionId, userEmail, password);
        } catch (ApiException e) {
            fail("Could not log the user in as '"+userEmail+"/"+password+"'!");
        }
        String idToken = exchangeAccessCodeForIdToken(sessionId, accessCode);
        checkIdTokenContainsNonce(idToken, nonce);
        return idToken;
    }

    /**
     * The standard authentication request, for when the client doesn't care about checking their nonce.
     */
    public static String sendInitialAuthenticationRequest() {
        return sendInitialAuthenticationRequest(UUID.randomUUID().toString());
    }

    /**
     * This is a standard authentication request, where the user has not logged in before.
     * <p>
     * This flow would redirect the user to login, but we're faking that too so we ignore the redirection.
     */
    public static String sendInitialAuthenticationRequest(String nonce) {
        LOGGER.info("Sending initial authentication request.");
        // The authentication flow includes a redirect to login. We don't want
        // anything interactive in testing so we need to take some steps to prevent the redirect:
        // 1. Don't use Swagger client - Swagger client will always accept and act on redirects
        // 2. Tweak Unirest configuration to disable its redirect handling.
        StringBuilder authenticationRequestParams = new StringBuilder();
        authenticationRequestParams.append("?scope=openid");
        authenticationRequestParams.append("&response_type=code");
        authenticationRequestParams.append("&client_id=");
        authenticationRequestParams.append(CLIENT_ID);
        authenticationRequestParams.append("&redirect_url=NOT_GOING_TO_USE_THIS");
        authenticationRequestParams.append("&state=");
        authenticationRequestParams.append("&nonce=");
        authenticationRequestParams.append(nonce);
        String authenticationRequestUrl =
                "http://localhost:8099/authentication/v1/authenticate" + authenticationRequestParams;
        // Disable redirect handling -- see note above.
        Unirest.setHttpClient(org.apache.http.impl.client.HttpClients.custom()
                .disableRedirectHandling()
                .build());


        HttpResponse authenticationRequestResponse = null;
        try {
            authenticationRequestResponse = Unirest
                    .get(authenticationRequestUrl)
                    .header("Content-Type", "application/json")
                    .asString();
        } catch (UnirestException e) {
            fail("Initial authentication request failed!");
        }

        assertThat(authenticationRequestResponse.getStatus()).isEqualTo(303);// 303 = See Other
        StringBuilder redirectionUrlBuilder = new StringBuilder();
        redirectionUrlBuilder.append("http://localhost:5000/login?error=login_required&state=&clientId=");
        redirectionUrlBuilder.append(CLIENT_ID);
        redirectionUrlBuilder.append("&redirectUrl=NOT_GOING_TO_USE_THIS");
        assertThat(authenticationRequestResponse.getHeaders().get("Location").get(0))
                .isEqualTo(redirectionUrlBuilder.toString());

        String sessionCookie = authenticationRequestResponse.getHeaders().get("Set-Cookie").get(0);
        // We need to do a bit of splitting and getting to pull out the sessionId. The cookie looks like this:
        // sessionId=d8948ce1-45a3-4422-aad3-fb4aa2228bdb;Version=1;Comment="Stroom session cookie";...
        String sessionId = sessionCookie.split(";")[0].split("=")[1];
        assertThat(sessionId).isNotEmpty();

        return sessionId;
    }

    /**
     * This logs the user in, using a given sessionId. In return it gets an access code.
     * <p>
     * The sessionId would be stored in a cookie and a normal relying party would not have to do this.
     */
    public static String performLogin(String sessionId, String username, String password) throws ApiException {
        LOGGER.info("Logging the user in.");
        ApiClient apiClient = new ApiClient();
        apiClient.setBasePath("http://localhost:8099");
        AuthenticationApi authenticationApi = new AuthenticationApi(apiClient);
        Credentials credentials = new Credentials();
        credentials.setEmail(username);
        credentials.setPassword(password);
        credentials.setSessionId(sessionId);
        credentials.setRequestingClientId(CLIENT_ID);
        ApiResponse<String> loginRequestResponse = authenticationApi.handleLoginWithHttpInfo(credentials);
        String accessCode = loginRequestResponse.getData();
        assertThat(accessCode).isNotEmpty();
        return accessCode;
    }

    public static String exchangeAccessCodeForIdToken(String sessionId, String accessCode) {
        LOGGER.info("Exchanging the access code for an ID token.");
        ApiClient apiClient = new ApiClient();
        apiClient.setBasePath("http://localhost:8099");
        AuthenticationApi authenticationApi = new AuthenticationApi(apiClient);
        String idToken = null;
        try {
            IdTokenRequest idTokenRequest = new IdTokenRequest();
            idTokenRequest.setRequestingClientId(CLIENT_ID);
            idTokenRequest.setSessionId(sessionId);
            idTokenRequest.setAccessCode(accessCode);
            idToken = authenticationApi.getIdTokenWithPost(idTokenRequest);
        } catch (ApiException e) {
            fail("Request to exchange access code for id token failed!");
        }

        assertThat(idToken).isNotEmpty();

        return idToken;
    }

    public static void checkIdTokenContainsNonce(String idToken, String nonce) {
        LOGGER.info("Verifying the nonce is in the id token");
        JwtConsumer consumer = new JwtConsumerBuilder()
                .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
                .setRequireSubject() // the JWT must have a subject claim
                .setVerificationKey(new HmacKey("CHANGE_ME".getBytes())) // verify the signature with the public key
                .setRelaxVerificationKeyValidation() // relaxes key length requirement
                .setExpectedIssuer("stroom")
                .build();
        JwtClaims claims = null;
        try {
            claims = consumer.processToClaims(idToken);
        } catch (InvalidJwtException e) {
            fail("Bad JWT returned from auth service");
        }
        String nonceHash = (String) claims.getClaimsMap().get("nonce");
        assertThat(nonceHash).isEqualTo(nonce);
    }
}
