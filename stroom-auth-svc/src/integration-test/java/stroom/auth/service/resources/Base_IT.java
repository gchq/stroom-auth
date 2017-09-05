package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import io.dropwizard.testing.ConfigOverride;
import io.dropwizard.testing.junit.DropwizardAppRule;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.App;

import static org.assertj.core.api.Assertions.assertThat;

public abstract class Base_IT {
  private static final Logger LOGGER = LoggerFactory.getLogger(Base_IT.class);

  @ClassRule
  public static final DropwizardAppRule appRule = new DropwizardAppRule(App.class, "config.yml", new ConfigOverride[0]);

  // The login URL naturally belongs in AuthenticationResource_IT but it's
  // here because other services need to log in and get JWS tokens.
  protected static String LOGIN_URL;
  protected static String BASE_TASKS_URL;
  protected static String HEALTH_CHECKS_URL;

  protected static int appPort;
  protected static int adminPort;

  @BeforeClass
  public static final void setupClass() throws InterruptedException {
    appPort = appRule.getLocalPort();
    adminPort = appRule.getAdminPort();
    LOGIN_URL = "http://localhost:" + appPort + "/authentication/v1/login";
    BASE_TASKS_URL = "http://localhost:" + adminPort + "/tasks/";
    HEALTH_CHECKS_URL = "http://localhost:" + adminPort + "/healthcheck?pretty=true";
    Thread.sleep(2000);
  }

  public final String loginAsAdmin() throws UnirestException {
    HttpResponse response = Unirest
        .post(LOGIN_URL)
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

}
