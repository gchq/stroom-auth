/*
 * Copyright 2020 Crown Copyright
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

package stroom.auth.resources.authentication.v1;

import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.ClientResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.AuthenticationSession;

import javax.servlet.http.HttpSession;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

class AuthenticationSessionUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationSessionUtil.class);
    private static final String AUTHENTICATION_SESSION = "AUTHENTICATION_SESSION";

    private Client logoutClient = ClientBuilder.newClient(new ClientConfig().register(ClientResponse.class));

//    public static void logout(final HttpSession session) {
//        getAuthenticationSession(session).ifPresent(authenticationSession -> {
//            authenticationSession.setAuthenticated(false);
//
//            authenticationSession.getRelyingParties().forEach(relyingParty -> {
//                // Not all relying parties can have a logout URI, i.e. remote web apps.
//                // So we need to check for null here.
//                if (relyingParty.getLogoutUri() != null) {
//                    String logoutUrl = relyingParty.getLogoutUri() + "/" + session.getId();
//                    Response response = logoutClient
//                            .target(logoutUrl)
//                            .request()
//                            .get();
//                    if (response.getStatus() != Response.Status.OK.getStatusCode()) {
//                        throw new RuntimeException("Unable to log out a relying party! I tried the following URL: " + logoutUrl);
//                    }
//                }
//            });
//        });
//
//        session.invalidate();
//    }

    public static String createAccessCode() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[20];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().encodeToString(bytes);
    }

    private static Optional<AuthenticationSession> getAuthenticationSession(final HttpSession session) {
        return Optional.ofNullable((AuthenticationSession) session.getAttribute(AUTHENTICATION_SESSION));
    }

    public static AuthenticationSession create(final HttpSession session) {
        AuthenticationSession authenticationSession = (AuthenticationSession) session.getAttribute(AUTHENTICATION_SESSION);
        if (authenticationSession == null) {
            authenticationSession = new AuthenticationSession();
            session.setAttribute(AUTHENTICATION_SESSION, authenticationSession);
        }
        return authenticationSession;
    }

//    public Optional<RelyingParty> getByAccessCode(String accessCode) {
//        for(AuthenticationSession session : sessions.values()){
//            for(RelyingParty relyingParty : session.getRelyingParties()){
//                if(relyingParty.getAccessCode() != null) {
//                    if (relyingParty.getAccessCode().equals(accessCode)) {
//                        return Optional.of(relyingParty);
//                    }
//                }
//            }
//        }
//        return Optional.empty();
//    }
}
