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
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.service.resources.support.HttpAsserts.assertOk;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnauthorised;

public final class UserResource_update_IT extends Base_IT {
  @Test
  public final void update_user() throws UnirestException, IOException {
    String jwsToken = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");

    // First create a user to update
    int userId = userManager.createUser(user, jwsToken);
    user.setEmail("New email" + Instant.now().toString());
    String serialisedUser = userManager.serialiseUser(user);
    String url = userManager.getRootUrl() + userId;
    HttpResponse response = Unirest
        .put(url)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serialisedUser)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(200);

    User updatedUser = userManager.getUser(userId, jwsToken);
    assertThat(updatedUser.getEmail()).isEqualTo(user.getEmail());
  }

  @Test
  public final void update_user_without_authorisation() throws UnirestException {
    String adminsJws = authenticationManager.loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    userManager.createUser(userA, adminsJws);
    String userAJws = authenticationManager.logInAsUser(userA);

    User userB = new User(Instant.now().toString(), "testPassword");
    int userBId = userManager.createUser(userB, adminsJws);

    // UserA tries to update UserB
    userB.setEmail("New email" + Instant.now().toString());
    String serialisedUserB = userManager.serialiseUser(userB);
    String url = userManager.getRootUrl() + userBId;
    HttpResponse response = Unirest
        .put(url)
        .header("Authorization", "Bearer " + userAJws)
        .header("Content-Type", "application/json")
        .body(serialisedUserB)
        .asString();
    assertUnauthorised(response);
  }

  @Test
  public final void update_self_basic_user() throws UnirestException {
    String adminsJws = authenticationManager.loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    int userAId = userManager.createUser(userA, adminsJws);
    String userAJws = authenticationManager.logInAsUser(userA);

    // UserA tries to update themselves
    userA.setEmail("New email" + Instant.now().toString());
    String serialisedUserA = userManager.serialiseUser(userA);
    String url = userManager.getRootUrl() + userAId;
    HttpResponse response = Unirest
        .put(url)
        .header("Authorization", "Bearer " + userAJws)
        .header("Content-Type", "application/json")
        .body(serialisedUserA)
        .asString();
    assertOk(response);
  }
}
