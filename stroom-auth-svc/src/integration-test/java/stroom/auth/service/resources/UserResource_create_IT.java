package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.user.v1.User;

import java.time.Instant;

public final class UserResource_create_IT extends UserResource_IT {
  @Test
  public final void create_user() throws UnirestException {
    String jwsToken = login();
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
    String jwsToken = login();
    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .asString();

    assertBadRequest(response);
  }

  @Test
  public final void create_user_missing_name() throws UnirestException {
    String jwsToken = login();
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
    String jwsToken = login();
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
    String jwsToken = login();
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
}
