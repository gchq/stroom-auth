package stroom.auth.service.resources;


import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserResource_update_IT extends UserResource_IT {
  @Test
  public final void update_user() throws UnirestException, IOException {
    String jwsToken = loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");

    // First create a user to update
    int userId = this.createUser(user, jwsToken);
    user.setEmail("New email" + Instant.now().toString());
    String serialisedUser = this.userMapper().toJson(user);
    String url = this.ROOT_URL + userId;
    HttpResponse response = Unirest
        .put(url)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serialisedUser)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(200);

    User updatedUser = getUser(userId, jwsToken);
    assertThat(updatedUser.getEmail()).isEqualTo(user.getEmail());
  }

  @Test
  public final void update_user_without_authorisation() throws UnirestException {
    String adminsJws = loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    createUser(userA, adminsJws);
    String userAJws = logInAsUser(userA);

    User userB = new User(Instant.now().toString(), "testPassword");
    int userBId = createUser(userB, adminsJws);

    // UserA tries to update UserB
    userB.setEmail("New email" + Instant.now().toString());
    String serialisedUserB = this.userMapper().toJson(userB);
    String url = this.ROOT_URL + userBId;
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
    String adminsJws = loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    int userAId = createUser(userA, adminsJws);
    String userAJws = logInAsUser(userA);

    // UserA tries to update themselves
    userA.setEmail("New email" + Instant.now().toString());
    String serialisedUserA = this.userMapper().toJson(userA);
    String url = this.ROOT_URL + userAId;
    HttpResponse response = Unirest
        .put(url)
        .header("Authorization", "Bearer " + userAJws)
        .header("Content-Type", "application/json")
        .body(serialisedUserA)
        .asString();
    assertOk(response);
  }
}
