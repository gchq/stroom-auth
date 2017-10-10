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

package stroom.auth.service.resources;

import javax.inject.Singleton;
import java.util.HashMap;
import java.util.Map;

@Singleton
public class SessionManager {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(SessionManager.class);

    Map<String, Session> sessions = new HashMap<>();


    public boolean isAuthenticated(String sessionId) {
        Session session = sessions.get(sessionId);
        return session != null && session.isAuthenticated();
    }
}
