/*
 * Copyright 2017 Crown Copyright
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

package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.AuthenticationFlowHelper;
import stroom.auth.service.ApiException;
import stroom.auth.service.resources.support.Base_IT;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Java6Assertions.fail;

public class Login_IT extends Base_IT {

    @Test
    public void incorrect_credentials_1() throws UnirestException {
        String sessionId = AuthenticationFlowHelper.sendInitialAuthenticationRequest();
        try {
            String accessCode = AuthenticationFlowHelper.performLogin(sessionId, "BAD", "admin");
            fail("Expected a 401!");
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(401);
        }
    }

    @Test
    public void incorrect_credentials_2() throws UnirestException {
        String sessionId = AuthenticationFlowHelper.sendInitialAuthenticationRequest();
        try {
            String accessCode = AuthenticationFlowHelper.performLogin(sessionId, "admin", "BAD");
            fail("Expected a 401!");
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(401);
        }
    }

    @Test
    public void incorrect_credentials_3() throws UnirestException {
        String sessionId = AuthenticationFlowHelper.sendInitialAuthenticationRequest();
        try {
            String accessCode = AuthenticationFlowHelper.performLogin(sessionId, "BAD", "BAD");
            fail("Expected a 401!");
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(401);
        }
    }

    @Test
    public void missing_credentials_1() throws UnirestException {
        String sessionId = AuthenticationFlowHelper.sendInitialAuthenticationRequest();
        try {
            String accessCode = AuthenticationFlowHelper.performLogin(sessionId, "BAD", "");
            fail("Expected a 400!");
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(400);
        }
    }

    @Test
    public void missing_credentials_2() throws UnirestException {
        String sessionId = AuthenticationFlowHelper.sendInitialAuthenticationRequest();
        try {
            String accessCode = AuthenticationFlowHelper.performLogin(sessionId, "", "");
            fail("Expected a 400!");
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(400);
        }
    }
}
