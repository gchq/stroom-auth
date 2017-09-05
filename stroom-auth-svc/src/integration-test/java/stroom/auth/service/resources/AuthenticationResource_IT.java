package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;

import static stroom.auth.service.resources.HttpAsserts.assertBadRequest;
import static stroom.auth.service.resources.HttpAsserts.assertUnauthorised;

public class AuthenticationResource_IT extends Base_IT {
  @Test
  public void good_login() throws UnirestException {
    // Most API tests need to login so the actual login method is in the base class.
    // We're adding it as a test here for completeness.
    authenticationManager.loginAsAdmin();
  }

  @Test
  public void incorrect_credentials_1() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"BAD\", \"password\" : \"admin\"}")
        .asString();
    assertUnauthorised(response);

  }

  @Test
  public void incorrect_credentials_2() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"admin\", \"password\" : \"BAD\"}")
        .asString();
    assertUnauthorised(response);
  }

  @Test
  public void incorrect_credentials_3() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"BAD\", \"password\" : \"BAD\"}")
        .asString();
    assertUnauthorised(response);
  }

  @Test
  public void missing_credentials_1() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("{\"email\" : \"BAD\"}")
        .asString();
    assertBadRequest(response);
  }

  @Test
  public void missing_credentials_2() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("\"password\" : \"admin\"}")
        .asString();
    assertBadRequest(response);
  }

  @Test
  public void missing_credentials_3() throws UnirestException {
    HttpResponse response = Unirest
        .post(authenticationManager.getLoginUrl())
        .header("Content-Type", "application/json")
        .body("")
        .asString();
    assertBadRequest(response);
  }
}
