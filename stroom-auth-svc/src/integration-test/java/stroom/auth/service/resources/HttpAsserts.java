package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;

import static org.assertj.core.api.Assertions.assertThat;

public class HttpAsserts {
  public static final void assertUnauthorised(HttpResponse response) {
    assertThat(response.getStatus()).isEqualTo(401);
  }

  public static final void assertBadRequest(HttpResponse response) {
    assertThat(response.getStatus()).isEqualTo(400);
  }

  public static final void assertConflict(HttpResponse response) {
    assertThat(response.getStatus()).isEqualTo(409);
  }

  public static final void assertOk(HttpResponse response) {
    assertThat(response.getStatus()).isEqualTo(200);
  }

  public static final void assertBodyNotNull(HttpResponse response) {
    String body = new String((String)response.getBody());
    assertThat(body).isNotNull();
  }
}
