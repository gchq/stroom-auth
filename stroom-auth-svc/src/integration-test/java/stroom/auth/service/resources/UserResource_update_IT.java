package stroom.auth.service.resources;


import java.io.IOException;
import java.time.Instant;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserResource_update_IT extends UserResource_IT {
  @Test
  public final void update_user() throws UnirestException, IOException {
    String jwsToken = login();
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
}
