package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.user.v1.User;

import java.time.Instant;

import static stroom.auth.service.resources.HttpAsserts.assertBadRequest;
import static stroom.auth.service.resources.HttpAsserts.assertBodyNotNull;
import static stroom.auth.service.resources.HttpAsserts.assertConflict;
import static stroom.auth.service.resources.HttpAsserts.assertOk;
import static stroom.auth.service.resources.HttpAsserts.assertUnauthorised;

public final class UserResource_create_IT extends UserResource_IT {
  @Test
  public final void create_user() throws UnirestException {
    String jwsToken = loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    String serializedUser = this.userMapper().toJson(user);

    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertOk(response);
    assertBodyNotNull(response);
  }

  @Test
  public final void create_user_missing_user() throws UnirestException {
    String jwsToken = loginAsAdmin();
    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_missing_name() throws UnirestException {
    String jwsToken = loginAsAdmin();
    User user = new User("", "testPassword");
    String serializedUser = this.userMapper().toJson(user);

    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_missing_password() throws UnirestException {
    String jwsToken = loginAsAdmin();
    User user = new User(Instant.now().toString(), "");
    String serializedUser = this.userMapper().toJson(user);

    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_with_duplicate_name() throws UnirestException {
    String jwsToken = loginAsAdmin();
    String emailToBeReused = Instant.now().toString();
    User user = new User(emailToBeReused, "testPassword");
    String serializedUser = this.userMapper().toJson(user);

    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serializedUser)
        .asString();

    assertOk(response);
    assertBodyNotNull(response);

    User duplicateUser = new User(emailToBeReused, "testPassword");
    String duplicateSerializedUser = this.userMapper().toJson(duplicateUser);
    HttpResponse duplicateResponse = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(duplicateSerializedUser)
        .asString();

    assertConflict(duplicateResponse);
  }

  @Test
  public final void create_user_with_no_authorisation() throws UnirestException {
    String adminsJws = loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    createUser(user, adminsJws);
    String newUsersJws = logInAsUser(user);

    // Try to use this new user to create another user
    User anotherUser = new User(Instant.now().toString(), "testPassword");
    String serializedAnotherUser = this.userMapper().toJson(anotherUser);
    HttpResponse createAnotherUserResponse = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + newUsersJws)
        .header("Content-Type", "application/json")
        .body(serializedAnotherUser)
        .asString();

    // 5. This new user won't have permission to create users, so this request should be rejected.
    assertUnauthorised(createAnotherUserResponse);
  }
}
