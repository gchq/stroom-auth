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

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.token.v1.SearchRequest;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenResource_delete_IT extends TokenResource_IT{

  @Test
  public void delete() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();
    String userEmail = "testUser_" + Instant.now().toString();
    userManager.createUser(new User(userEmail, "password"), securityToken);
    String token = tokenManager.createToken(userEmail, Token.TokenType.USER, securityToken);
    tokenManager.createToken(userEmail, Token.TokenType.API, securityToken);
    tokenManager.createToken(userEmail, Token.TokenType.API, securityToken);
    tokenManager.deleteToken(token, securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(10)
        .orderBy("expires_on")
        .filters(new HashMap<String, String>()
          {{
            put("user_email", userEmail);
          }})
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
    assertThat(tokens.size()).isEqualTo(2);
  }

  @Test
  public void deleteAll() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();
    String userEmail = "testUser_" + Instant.now().toString();
    createUserAndTokens(userEmail, securityToken);
    tokenManager.deleteAllTokens(securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(10)
        .orderBy("expires_on")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    String newSecurityToken = clearTokensAndLogin();
    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + newSecurityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
    // We can't access tokens without a token for the admin user
    assertThat(tokens.size()).isEqualTo(1);
  }

}
