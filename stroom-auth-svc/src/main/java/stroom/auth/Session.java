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

public class Session {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(Session.class);

    private String accessCode;
    private String idToken;
    private String sessionId;
    private boolean isAuthenticated;
    private String userEmail;
    private String nonce;
    private String state;
    private String clientId;

    public String getAccessCode() {
        return accessCode;
    }

    public void setAccessCode(String accessCode) {
        this.accessCode = accessCode;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isAuthenticated() {
        return isAuthenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        isAuthenticated = authenticated;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setNonce(String nonce) {
        this.nonce = nonce;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getNonce() {
        return nonce;
    }

    public String getState() {
        return state;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public void forgetIdToken() {
        this.idToken = null;
    }

    public void forgetAccessCode() {
        this.accessCode = null;
    }
}
