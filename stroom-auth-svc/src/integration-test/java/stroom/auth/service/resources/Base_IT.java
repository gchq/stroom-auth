package stroom.auth.service.resources;

import io.dropwizard.testing.ConfigOverride;
import io.dropwizard.testing.junit.DropwizardAppRule;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import stroom.auth.service.App;

public abstract class Base_IT {

  @ClassRule
  public static final DropwizardAppRule appRule = new DropwizardAppRule(App.class, "config.yml", new ConfigOverride[0]);

  protected static String BASE_TASKS_URL;
  protected static String HEALTH_CHECKS_URL;

  protected static int appPort;
  protected static int adminPort;

  protected static UserManager userManager = new UserManager();
  protected static AuthenticationManager authenticationManager = new AuthenticationManager();

  @BeforeClass
  public static final void setupClass() throws InterruptedException {
    appPort = appRule.getLocalPort();
    authenticationManager.setPort(appPort);
    userManager.setPort(appPort);

    adminPort = appRule.getAdminPort();
    BASE_TASKS_URL = "http://localhost:" + adminPort + "/tasks/";
    HEALTH_CHECKS_URL = "http://localhost:" + adminPort + "/healthcheck?pretty=true";
    Thread.sleep(2000);
  }
}
