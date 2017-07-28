package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserResource_delete_IT extends UserResource_IT {
  @Test
  public final void delete_user() throws UnirestException, IOException {
    String jwsToken = login();
    User user = new User(Instant.now().toString(), "testPassword");
    int userId = this.createUser(user, jwsToken);
    String url = this.ROOT_URL + userId;

    HttpResponse response = Unirest
        .delete(url)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .asJson();

    User shouldBeNull = getUser(userId, jwsToken);
    assertThat(shouldBeNull).isNull();
  }
}
