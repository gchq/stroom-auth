package stroom.auth.service;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import com.codahale.metrics.health.HealthCheck;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Class to present all the defined log levels as a health check so you can view all log levels as
 * they are at run time. Log levels can be changed using 'httpie' like this:
 * http -f POST http://127.0.0.1:8100/tasks/log-level logger=logger=stroom.auth.resources.authentication.v1.AuthenticationResource level=DEBUG
 */
class LogLevelInspector extends HealthCheck {
  @Override
  protected Result check() throws Exception {
    LoggerContext loggerContext = ((LoggerContext) LoggerFactory.getILoggerFactory());

    if (loggerContext != null) {
      //use a treemap so se get the levels nicely sorted
      Map<String, String> levels = loggerContext.getLoggerList().stream()
          .filter(logger -> logger.getLevel() != null)
          .collect(Collectors.toMap(
              Logger::getName,
              logger -> logger.getLevel().levelStr,
              (v1, v2) -> v1 + ", " + v2, //don't think we will ever get dups, but just in case concat them
              TreeMap::new));

      return HealthCheck.Result.builder()
          .healthy()
          .withDetail("levels", levels)
          .build();
    } else {
      return HealthCheck.Result.unhealthy("Unable to obtain levels, LoggerContext is null");
    }
  }
}