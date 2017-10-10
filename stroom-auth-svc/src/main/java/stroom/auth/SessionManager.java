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

import stroom.auth.config.Config;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Singleton
public class SessionManager {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(SessionManager.class);

    Map<String, Session> sessions = new HashMap<>();
    private Config config;
    private TokenBuilderFactory tokenBuilderFactory;

    @Inject
    public SessionManager(Config config, TokenBuilderFactory tokenBuilderFactory){
        this.config = config;
        this.tokenBuilderFactory = tokenBuilderFactory;
    }

    public boolean isAuthenticated(String sessionId) {
        Session session = getOrCreate(sessionId);
        return session != null && session.isAuthenticated();
    }

    public static String createAccessCode(){
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[20];
        secureRandom.nextBytes(bytes);
        String accessCode = new String(bytes);
        return accessCode;
    }

    public Session getOrCreate(String sessionId){
        Session session = sessions.get(sessionId);
        if(session == null){
            session = new Session();
            session.setSessionId(sessionId);
            sessions.put(sessionId, session);
        }
        return session;
    }

    public Optional<Session> get(String id) {
        return Optional.ofNullable(sessions.get(id));
    }
}
