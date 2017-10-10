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
import stroom.auth.resources.token.v1.Token;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.service.resources.support.HttpAsserts.assertBadRequest;
import static stroom.auth.service.resources.support.HttpAsserts.assertOk;
import static stroom.auth.resources.token.v1.Token.TokenType.API;

/**
 * TODO: create with issued date in the past; create with expiry date in the past; create with invalid token type
 */
public class TokenResource_create_IT extends TokenResource_IT {

  @Test
  public void simpleCreate() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    String token = tokenManager.createToken("admin", API, securityToken);

    HttpResponse response = Unirest
        .get(url + "/byToken/" + token)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .asString();

    assertOk(response);
    tokenManager.deserialiseToken((String)response.getBody());
  }

  @Test
  public void create_with_bad_user() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    String expiresOn = Instant.now().plusSeconds(604800).toString();
    String issuedOn = Instant.now().toString();

    Token token = new Token.TokenBuilder()
        .token(securityToken)
        .tokenType(API.getText())
        .enabled(true)
        .expiresOn(expiresOn)
        .issuedOn(issuedOn)
        .userEmail("badUser")
        .build();

    String serializedToken = tokenManager.serialiseToken(token);

    HttpResponse response = Unirest
        .post(tokenManager.getRootUrl())
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + securityToken)
        .body(serializedToken)
        .asString();

    assertBadRequest(response);
  }
}
