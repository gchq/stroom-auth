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

public final class UserResource_read_IT extends UserResource_IT {

  @Test
  public final void search_users() throws UnirestException, IOException {
    String jwsToken = loginAsAdmin();
    String url = ROOT_URL;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public final void read_current_user() throws UnirestException, IOException, InterruptedException {
    String jwsToken = loginAsAdmin();
    HttpResponse response = Unirest
        .get(ME_URL)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    String body = (String)response.getBody();
    List<User> user = (List<User>)userListMapper().fromJson(body);
    if(user != null) {
      assertThat(user.get(0).getEmail()).isEqualTo("admin");
    }
    else fail("No users found");
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public final void read_user_that_doesnt_exist() throws UnirestException {
    String jwsToken = loginAsAdmin();
    String url = ROOT_URL + "97862345983458";
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(404);
  }

  @Test
  public final void read_other_user_with_authorisation() throws UnirestException {
    String adminsJws = loginAsAdmin();
    User user = new User(Instant.now().toString(), "testPassword");
    int userId = createUser(user, adminsJws);

    String url = ROOT_URL + userId;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + adminsJws)
        .asString();
    assertOk(response);
  }

  @Test
  public final void read_other_user_without_authorisation() throws UnirestException {
    String adminsJws = loginAsAdmin();

    User userA = new User(Instant.now().toString(), "testPassword");
    createUser(userA, adminsJws);

    User userB = new User(Instant.now().toString(), "testPassword");
    int userBId = createUser(userB, adminsJws);

    String userAJws= logInAsUser(userA);
    String url = ROOT_URL + userBId;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + userAJws)
        .asString();
    assertUnauthorised(response);
  }

}
