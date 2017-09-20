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
import stroom.auth.service.resources.user.v1.User;

import java.time.Instant;

import static stroom.auth.service.resources.support.HttpAsserts.assertBadRequest;
import static stroom.auth.service.resources.support.HttpAsserts.assertBodyNotNull;
import static stroom.auth.service.resources.support.HttpAsserts.assertConflict;
import static stroom.auth.service.resources.support.HttpAsserts.assertOk;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnauthorised;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnprocessableEntity;

public final class UserResource_create_IT extends Base_IT {
  @Test
  public final void create_user() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    String serializedUser = userManager.serialiseUser(user);

    HttpResponse response = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertOk(response);
    assertBodyNotNull(response);
  }

  @Test
  public final void create_user_missing_user() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    HttpResponse response = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .asString();

    assertUnprocessableEntity(response);
  }

  @Test
  public final void create_user_missing_name() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    User user = new User("", "testPassword");
    String serializedUser = userManager.serialiseUser(user);

    HttpResponse response = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_missing_password() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "");
    String serializedUser = userManager.serialiseUser(user);

    HttpResponse response = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_with_duplicate_name() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    String emailToBeReused = Instant.now().toString();
    User user = new User(emailToBeReused, "testPassword");
    String serializedUser = userManager.serialiseUser(user);

    HttpResponse response = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertOk(response);
    assertBodyNotNull(response);

    User duplicateUser = new User(emailToBeReused, "testPassword");
    String duplicateSerializedUser = userManager.serialiseUser(duplicateUser);
    HttpResponse duplicateResponse = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(duplicateSerializedUser)
        .asString();

    assertConflict(duplicateResponse);
  }

  @Test
  public final void create_user_with_no_authorisation() throws UnirestException {
    String adminsJws = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    userManager.createUser(user, adminsJws);
    String newUsersJws = authenticationManager.logInAsUser(user);

    // Try to use this new user to create another user
    User anotherUser = new User(Instant.now().toString(), "testPassword");
    String serializedAnotherUser = userManager.serialiseUser(anotherUser);
    HttpResponse createAnotherUserResponse = Unirest
        .post(userManager.getRootUrl())
        .header("Authorization", "Bearer " + newUsersJws)
        .header("Content-Type", "application/json")
        .body(serializedAnotherUser)
        .asString();

    // This new user won't have permission to create users, so this request should be rejected.
    assertUnauthorised(createAnotherUserResponse);
  }
}
