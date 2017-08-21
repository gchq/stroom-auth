package stroom.auth.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import org.simplejavamail.mailer.config.TransportStrategy;

import javax.validation.constraints.NotNull;

public class SmtpConfig extends Configuration {

  @NotNull
  @JsonProperty
  private String host;

  @NotNull
  @JsonProperty
  private int port;

  @NotNull
  @JsonProperty
  private String transport;

  @NotNull
  @JsonProperty
  private String username;

  @NotNull
  @JsonProperty
  private String password;

  public String getHost() {
    return host;
  }

  public int getPort() {
    return port;
  }

  public String getUsername() {
    return username;
  }

  public String getPassword() {
    return password;
  }

  public String getTransport() {
    return transport;
  }

  public TransportStrategy getTransportStrategy() {
    switch(transport){
      case "TLS": return TransportStrategy.SMTP_TLS;
      case "SSL": return TransportStrategy.SMTP_TLS;
      case "plain": return TransportStrategy.SMTP_PLAIN;
      default: return TransportStrategy.SMTP_PLAIN;
    }
  }
}
