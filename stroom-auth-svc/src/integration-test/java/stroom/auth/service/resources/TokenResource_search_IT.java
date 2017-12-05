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
import org.assertj.core.api.Condition;
import org.jose4j.lang.JoseException;
import org.junit.Test;
import stroom.auth.AuthenticationFlowHelper;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.service.ApiException;
import stroom.auth.service.ApiResponse;
import stroom.auth.service.api.ApiKeyApi;
import stroom.auth.service.api.UserApi;
import stroom.auth.service.api.model.CreateTokenRequest;
import stroom.auth.service.api.model.SearchResponse;
import stroom.auth.service.api.model.User;

import java.io.IOException;
import java.util.HashMap;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Java6Assertions.fail;
import static org.assertj.core.util.Sets.newLinkedHashSet;
import static stroom.auth.resources.token.v1.Token.TokenType.API;
import static stroom.auth.resources.token.v1.Token.TokenType.EMAIL_RESET;
import static stroom.auth.resources.token.v1.Token.TokenType.USER;

public class TokenResource_search_IT extends TokenResource_IT {

    @Test
    public void simple_search() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);

        CreateTokenRequest createTokenRequest = new CreateTokenRequest();
        createTokenRequest.setUserEmail("admin");
        createTokenRequest.setTokenType(API.getText());
        apiKeyApiClient.create(createTokenRequest);

        stroom.auth.service.api.model.SearchRequest searchRequest = new stroom.auth.service.api.model.SearchRequest();
        searchRequest.setPage(0);
        searchRequest.setLimit(10);
        searchRequest.setOrderBy("expires_on");
        ApiResponse<SearchResponse> response = apiKeyApiClient.searchWithHttpInfo(searchRequest);

        assertThat(response.getData().getTokens().size()).isGreaterThan(0);
        assertThat(response.getStatusCode()).isEqualTo(200);
    }

    @Test
    public void multipage_search() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);

        apiKeyApiClient.deleteAllWithHttpInfo();
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user6_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user7_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user8_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user9_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user10_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user11_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);

        // We expect three times as many tokens as users because we're creating API tokens, user tokens, and email reset tokens.
        getPageAndAssert(0, 5, 5, apiKeyApiClient);
        getPageAndAssert(1, 5, 5, apiKeyApiClient);
        getPageAndAssert(2, 5, 5, apiKeyApiClient);
        getPageAndAssert(3, 5, 5, apiKeyApiClient);
        getPageAndAssert(4, 5, 5, apiKeyApiClient);
        getPageAndAssert(5, 5, 5, apiKeyApiClient);
        int expectedFinalCount = 3; // This rounds up to 33 tokens from the above setup.
        getPageAndAssert(6, 5, expectedFinalCount, apiKeyApiClient);
    }

    @Test
    public void search_ordering_by_token_type() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);

        apiKeyApiClient.deleteAllWithHttpInfo();
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);

        ApiResponse<SearchResponse> response = apiKeyApiClient.searchWithHttpInfo(new stroom.auth.service.api.model.SearchRequest()
                .page(0)
                .limit(5)
                .orderBy("token_type"));

        Token.TokenType expectedType = API;
        assertThat(response.getData().getTokens().size()).isEqualTo(5);
        assertThat(response.getStatusCode()).isEqualTo(200);
        response.getData().getTokens().forEach(token ->
                assertThat(token.getTokenType()).isEqualTo(expectedType.getText()));
    }

    @Test
    public void search_ordering_by_token_type_asc() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);

        apiKeyApiClient.deleteAllWithHttpInfo();
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), 3, apiKeyApiClient, userApi);

        ApiResponse<SearchResponse> response = apiKeyApiClient.searchWithHttpInfo(
                new stroom.auth.service.api.model.SearchRequest()
                        .page(0)
                        .limit(5)
                        .orderBy("token_type")
                        .orderDirection("asc"));

        Token.TokenType expectedType = API;

        assertThat(response.getData().getTokens().size()).isEqualTo(5);
        assertThat(response.getStatusCode()).isEqualTo(200);

        response.getData().getTokens().forEach(result ->
                assertThat(result.getTokenType().toLowerCase()).isEqualTo(expectedType.getText().toLowerCase()));
    }

    @Test
    public void search_ordering_by_token_type_desc() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);

        // Make sure we've got a clean database
        apiKeyApiClient.deleteAllWithHttpInfo();

        createUserAndTokens("user1_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);

        ApiResponse<SearchResponse> response = apiKeyApiClient.searchWithHttpInfo(
                new stroom.auth.service.api.model.SearchRequest()
                        .page(0)
                        .limit(5)
                        .orderBy("token_type")
                        .orderDirection("desc"));

        assertThat(response.getData().getTokens().size()).isEqualTo(5);
        assertThat(response.getStatusCode()).isEqualTo(200);

        response.getData().getTokens().forEach(result ->
                assertThat(result.getTokenType()).isEqualTo(USER.getText()));
    }

    @Test
    public void orderDirection_validity() throws UnirestException, IOException, ApiException, JoseException{
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        assertOrderDirectionValidity("BAD", false, idToken);
        assertOrderDirectionValidity("ascc", false, idToken);
        assertOrderDirectionValidity("aasc", false, idToken);
        assertOrderDirectionValidity("descc", false, idToken);
        assertOrderDirectionValidity("ddesc", false, idToken);

        assertOrderDirectionValidity("asc", true, idToken);
        assertOrderDirectionValidity("desc", true, idToken);
    }

    @Test
    public void orderBy_validity() throws UnirestException, IOException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();

        // Bad orderBy values
        assertOrderByValidity("BAD", false, idToken);
        assertOrderByValidity("enabledd", false, idToken);
        assertOrderByValidity("aenabled", false, idToken);
        assertOrderByValidity("user_emaila", false, idToken);
        assertOrderByValidity("auser_email", false, idToken);
        assertOrderByValidity("issued_by_usera", false, idToken);
        assertOrderByValidity("jissued_by_user", false, idToken);
        assertOrderByValidity("tokene", false, idToken);
        assertOrderByValidity("etoken", false, idToken);
        assertOrderByValidity("token_typea", false, idToken);
        assertOrderByValidity("otoken_type", false, idToken);
        assertOrderByValidity("updated_by_userj", false, idToken);
        assertOrderByValidity("qupdated_by_user", false, idToken);

        // Valid orderBy values
        assertOrderByValidity("enabled", true, idToken);
        assertOrderByValidity("user_email", true, idToken);
        assertOrderByValidity("issued_by_user", true, idToken);
        assertOrderByValidity("token", true, idToken);
        assertOrderByValidity("token_type", true, idToken);
        assertOrderByValidity("updated_by_user", true, idToken);
        assertOrderByValidity("expires_on", true, idToken);
        assertOrderByValidity("issued_on", true, idToken);
        assertOrderByValidity("updated_on", true, idToken);
    }

    @Test
    public void search_on_user() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        ApiKeyApi apiKeyApiClient = SwaggerHelper.newApiKeyApiClient(idToken);
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);

        // Make sure we've got a clean database
        apiKeyApiClient.deleteAllWithHttpInfo();

        createUserAndTokens("user1_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user1_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user2_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user3_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user4_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user5_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user10_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user10_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user10_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user11_" + UUID.randomUUID().toString(), API, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user11_" + UUID.randomUUID().toString(), USER, 1, apiKeyApiClient, userApi);
        createUserAndTokens("user11_" + UUID.randomUUID().toString(), EMAIL_RESET, 1, apiKeyApiClient, userApi);

        ApiResponse<SearchResponse> response = apiKeyApiClient.searchWithHttpInfo(
                new stroom.auth.service.api.model.SearchRequest()
                        .filters(new HashMap() {{
                            put("user_email", "user1");
                        }})
                        .page(0)
                        .limit(10)
                        .orderBy("expires_on"));

        int expectedNumberOfTokens = 9; // 3 users should match the filter and they'll have 3 tokens each (API, USER, EMAIL_RESET)
        assertThat(response.getData().getTokens().size()).isEqualTo(expectedNumberOfTokens);
        response.getData().getTokens().forEach(result -> assertThat(result.getUserEmail()).contains("user1"));
    }

    @Test
    public void search_on_validity() throws UnirestException, IOException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();

        assertFilterValidity("bad", false, idToken);
        assertFilterValidity("expires_on", false, idToken);
        assertFilterValidity("issued_on", false, idToken);
        assertFilterValidity("updated_on", false, idToken);

        assertFilterValidity("enabled", true, idToken);
        assertFilterValidity("user_email", true, idToken);
        assertFilterValidity("issued_by_user", true, idToken);
        assertFilterValidity("token", true, idToken);
        assertFilterValidity("token_type", true, idToken);
        assertFilterValidity("updated_by_user", true, idToken);
    }

    private void assertOrderDirectionValidity(String orderDirection, boolean isValid, String idToken) throws UnirestException, ApiException {
        ApiKeyApi apiKeyApi = SwaggerHelper.newApiKeyApiClient(idToken);

        try {
            ApiResponse<SearchResponse> response = apiKeyApi.searchWithHttpInfo(
                    new stroom.auth.service.api.model.SearchRequest().page(0).limit(5).orderBy("enabled").orderDirection(orderDirection));
            if (isValid) {
                assertThat(response.getStatusCode()).isEqualTo(200);
            }
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(400);
        }
    }

    private void assertOrderByValidity(String orderBy, boolean isValid, String securityToken) throws UnirestException {
        ApiKeyApi apiKeyApi = SwaggerHelper.newApiKeyApiClient(securityToken);

        try {
            ApiResponse<SearchResponse> response = apiKeyApi.searchWithHttpInfo(
                    new stroom.auth.service.api.model.SearchRequest().page(0).limit(5).orderBy(orderBy));
            if (isValid) {
                assertThat(response.getStatusCode()).isEqualTo(200);
            }
        } catch (ApiException e) {
            assertThat(e.getCode()).isEqualTo(400);
        }
    }

    private void assertFilterValidity(String filterOn, boolean isValid, String securityToken) throws UnirestException {
        ApiKeyApi apiKeyApi = SwaggerHelper.newApiKeyApiClient(securityToken);
        try {
            ApiResponse<SearchResponse> response = apiKeyApi.searchWithHttpInfo(
                    new stroom.auth.service.api.model.SearchRequest()
                            .filters(new HashMap() {{
                                put(filterOn, "something");
                            }})
                            .page(0)
                            .limit(10)
                            .orderBy("expires_on"));
        } catch (ApiException e) {
            if (isValid) {
                fail("Request should have been valid");
            }
            Condition<Integer> invalidResponseCodes = new Condition<>(newLinkedHashSet(400, 422)::contains, "Invalid response codes");
            assertThat(e.getCode()).is(invalidResponseCodes);
        }
    }

    private void createUserAndTokens(String userEmail, int numberOfTokens, ApiKeyApi apiKeyApi,
                                     UserApi userApi) throws ApiException {
        createUserAndTokens(userEmail, API, numberOfTokens, apiKeyApi, userApi);
    }

    private void createUserAndTokens(String userEmail, Token.TokenType tokenType, int numberOfTokens, ApiKeyApi apiKeyApi,
                                     UserApi userApi) throws ApiException {
        User user = createUser(userEmail, userApi);
        for (int i = 0; i < numberOfTokens; i++) {
            createToken(user.getEmail(), tokenType, apiKeyApi);
        }
    }

    private User createUser(String userEmail, UserApi userApi) throws ApiException {
        User user = new User();
        user.setEmail(userEmail);
        user.setPassword("password");
        try {
            userApi.createUserWithHttpInfo(user);
        } catch (ApiException e) {
            fail("Unable to create a new user!");
        }

        return user;
    }

    private stroom.auth.service.api.model.Token createToken(String userEmail, Token.TokenType tokenType, ApiKeyApi apiKeyApi) {
        CreateTokenRequest createTokenRequest = new CreateTokenRequest();
        createTokenRequest.setUserEmail(userEmail);
        createTokenRequest.setTokenType(tokenType.getText());
        stroom.auth.service.api.model.Token token = null;
        try {
            stroom.auth.service.api.model.Token id = apiKeyApi.create(createTokenRequest);
            token = apiKeyApi.read_0(id.getId());
        } catch (ApiException e) {
            fail("Unable to create a new token!");
        }
        return token;
    }

    private void getPageAndAssert(int page, int limit, int expectedCount, ApiKeyApi apiKeyApi) throws UnirestException, IOException, ApiException {
        stroom.auth.service.api.model.SearchRequest searchRequest = new stroom.auth.service.api.model.SearchRequest();
        searchRequest.setLimit(limit);
        searchRequest.setPage(page);
        ApiResponse<SearchResponse> searchResponse = apiKeyApi.searchWithHttpInfo(searchRequest);

        assertThat(searchResponse.getData().getTokens().size()).isEqualTo(expectedCount);
        assertThat(searchResponse.getStatusCode()).isEqualTo(200);
    }

}
