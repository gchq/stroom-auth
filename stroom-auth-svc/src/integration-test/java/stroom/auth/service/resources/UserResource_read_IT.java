package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Java6Assertions.fail;

public final class UserResource_read_IT extends UserResource_IT {

  @Test
  public final void search_users() throws UnirestException, IOException {
    String jwsToken = login();
    String url = ROOT_URL;
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public final void read_current_user() throws UnirestException, IOException, InterruptedException {
    String jwsToken = login();
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
    String jwsToken = login();
    String url = ROOT_URL + "97862345983458";
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asJson();
    assertThat(response.getStatus()).isEqualTo(404);
  }
}
