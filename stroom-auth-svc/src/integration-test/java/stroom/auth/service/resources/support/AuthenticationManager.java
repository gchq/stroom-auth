package stroom.auth.service.resources.support;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.resources.user.v1.User;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthenticationManager {
  private static final Logger LOGGER = LoggerFactory.getLogger(Base_IT.class);
  private String loginUrl;

  public final String loginAsAdmin() throws UnirestException {
    HttpResponse response = Unirest
        .post(loginUrl)
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"admin\", \"password\" : \"admin\"}")
        .asString();

    LOGGER.info("Response: {}", response.getBody());
    String jwsToken = (String) response.getBody();
    assertThat(response.getStatus()).isEqualTo(200);
    // This is the first part of the token, which doesn't change
    assertThat(jwsToken).contains("eyJhbGciOiJIUzI1NiJ9");
    return jwsToken;
  }

  public final String logInAsUser(User user) throws UnirestException {
    HttpResponse getJwsResponse = Unirest
        .post(loginUrl)
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"" + user.getEmail() + "\", \"password\" : \"testPassword\"}")
        .asString();
    String newUsersJws = (String) getJwsResponse.getBody();
    return newUsersJws;
  }

  public void setPort(int appPort) {
    this.loginUrl = "http://localhost:" + appPort + "/authentication/v1/login";
  }

  public String getLoginUrl(){
    return this.loginUrl;
  }
}
