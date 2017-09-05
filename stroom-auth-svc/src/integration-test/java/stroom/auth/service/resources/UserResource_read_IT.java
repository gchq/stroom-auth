package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Java6Assertions.fail;
import static stroom.auth.service.resources.HttpAsserts.assertOk;
import static stroom.auth.service.resources.HttpAsserts.assertUnauthorised;

public final class UserResource_read_IT extends Base_IT {

  @Test
  public final void search_users() throws UnirestException, IOException {
    String jwsToken = authenticationManager.loginAsAdmin();
    String url = userManager.getRootUrl();
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public final void read_current_user() throws UnirestException, IOException, InterruptedException {
    String jwsToken = authenticationManager.loginAsAdmin();
    HttpResponse response = Unirest
        .get(userManager.getMeUrl())
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    String body = (String) response.getBody();
    List<User> user = userManager.parseUsers(body);
    if (user != null) {
      assertThat(user.get(0).getEmail()).isEqualTo("admin");
    } else fail("No users found");
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public final void read_user_that_doesnt_exist() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    String url = userManager.getRootUrl() + "97862345983458";
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(404);
  }

  @Test
  public final void read_other_user_with_authorisation() throws UnirestException {
    String adminsJws = authenticationManager.loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    int userId = userManager.createUser(user, adminsJws);

    String url = userManager.getRootUrl() + userId;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + adminsJws)
        .asString();
    assertOk(response);
  }

  @Test
  public final void read_other_user_without_authorisation() throws UnirestException {
    String adminsJws = authenticationManager.loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    userManager.createUser(userA, adminsJws);

    User userB = new User(Instant.now().toString(), "testPassword");
    int userBId = userManager.createUser(userB, adminsJws);

    String userAJws = authenticationManager.logInAsUser(userA);
    String url = userManager.getRootUrl() + userBId;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + userAJws)
        .asString();
    assertUnauthorised(response);
  }

}
