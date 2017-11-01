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

import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.ClientResponse;
import stroom.auth.config.Config;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Singleton
public class SessionManager {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(SessionManager.class);

    Map<String, Session> sessions = new HashMap<>();
    private Config config;
    private TokenBuilderFactory tokenBuilderFactory;

    private Client logoutClient = ClientBuilder.newClient(new ClientConfig().register(ClientResponse.class));


    @Inject
    public SessionManager(Config config, TokenBuilderFactory tokenBuilderFactory) {
        this.config = config;
        this.tokenBuilderFactory = tokenBuilderFactory;
    }

    public boolean isAuthenticated(String sessionId) {
        Session session = getOrCreate(sessionId);
        return session != null && session.isAuthenticated();
    }

    public static String createAccessCode() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[20];
        secureRandom.nextBytes(bytes);
        String accessCode = Base64.getUrlEncoder().encodeToString(bytes);
        return accessCode;
    }

    public Session getOrCreate(String sessionId) {
        Session session = sessions.get(sessionId);
        if (session == null) {
            session = new Session();
            session.setSessionId(sessionId);
            sessions.put(sessionId, session);
        }
        return session;
    }

    public Optional<Session> get(String id) {
        return Optional.ofNullable(sessions.get(id));
    }

    public void logout(String sessionId) {
        Optional<Session> session = get(sessionId);

        if (!session.isPresent()) {
            // We might get a logout for a session that doesn't exist - e.g. if there's been a bounce. It's
            // not necessarily an error and we need to handle it gracefully.
            LOGGER.warn("Tried to log out of a session that doesn't exist: " + sessionId);
            return;
        }

        session.get().setAuthenticated(false);

        session.get().getRelyingParties().forEach(relyingParty -> {
            // Not all relying parties can have a logout URI, i.e. remote web apps.
            // So we need to check for null here.
            if (relyingParty.getLogoutUri() != null) {
                String logoutUrl = relyingParty.getLogoutUri() + "/" + sessionId;
                Response response = logoutClient
                        .target(logoutUrl)
                        .request()
                        .get();
                if (response.getStatus() != Response.Status.OK.getStatusCode()) {
                    throw new RuntimeException("Unable to log out a relying party! I tried the following URL: " + logoutUrl);
                }
            }
        });

        sessions.remove(sessionId);
    }

    public Session create(String sessionId) {
        Session session = new Session();
        session.setSessionId(sessionId);
        sessions.put(sessionId, session);
        return session;
    }
}
