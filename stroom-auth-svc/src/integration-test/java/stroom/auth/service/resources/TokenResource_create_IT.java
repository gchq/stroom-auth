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
import org.jose4j.lang.JoseException;
import org.junit.Ignore;
import org.junit.Test;
import stroom.auth.AuthenticationFlowHelper;
import stroom.auth.service.ApiException;
import stroom.auth.service.ApiResponse;
import stroom.auth.service.api.ApiKeyApi;
import stroom.auth.service.api.model.CreateTokenRequest;
import stroom.auth.service.api.model.Token;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.fail;

/**
 * TODO: create with issued date in the past; create with expiry date in the past; create with invalid token type
 */
public class TokenResource_create_IT extends TokenResource_IT {

    @Test
    public void simpleCreate() throws Exception {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();

        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);

        CreateTokenRequest createTokenRequest = new CreateTokenRequest();
        createTokenRequest.setUserEmail("admin");
        createTokenRequest.setTokenType("api");
        createTokenRequest.setEnabled(false);
        createTokenRequest.setComments("Created by TokenResource_create_IT");
        Token newApiKeyId = apiKeyApiClient.create(createTokenRequest);

        // Use the id to get the Jws
        Token newApiKeyJws = apiKeyApiClient.read_0(newApiKeyId.getId());
        assertThat(newApiKeyJws).isNotNull();

        // Now try and read using the api key itself
        ApiResponse<Token> response = apiKeyApiClient.readWithHttpInfo(newApiKeyJws.getToken());
        assertThat(response.getStatusCode()).isEqualTo(200);
    }

    @Test
    public void create_with_bad_user() throws Exception {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();

        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);

        CreateTokenRequest createTokenRequest = new CreateTokenRequest();
        createTokenRequest.setUserEmail("BAD_USER");
        createTokenRequest.setTokenType("api");
        createTokenRequest.setEnabled(false);
        createTokenRequest.setComments("Created by TokenResource_create_IT");
        try {
            Token newApiKeyId = apiKeyApiClient.create(createTokenRequest);
            fail();
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(400);
        }
    }
}
