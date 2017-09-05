package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnauthorised;

public final class UserResource_delete_IT extends Base_IT {
  @Test
  public final void delete_user() throws UnirestException, IOException {
    String jwsToken = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    int userId = userManager.createUser(user, jwsToken);
    String url = userManager.getRootUrl() + userId;

    HttpResponse response = Unirest
        .delete(url)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .asJson();

    User shouldBeNull = userManager.getUser(userId, jwsToken);
    assertThat(shouldBeNull).isNull();
  }

  @Test
  public final void delete_user_without_authorisation() throws UnirestException, IOException {
    String adminsJws = authenticationManager.loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    userManager.createUser(userA, adminsJws);
    String userAJws = authenticationManager.logInAsUser(userA);

    User userB = new User(Instant.now().toString(), "testPassword");
    int userBId = userManager.createUser(userB, adminsJws);

    String url = userManager.getRootUrl() + userBId;

    HttpResponse response = Unirest
        .delete(url)
        .header("Authorization", "Bearer " + userAJws)
        .header("Content-Type", "application/json")
        .asString();

    assertUnauthorised(response);
  }
}
