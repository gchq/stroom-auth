package stroom.auth.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;

import javax.validation.constraints.NotNull;

public class EmailConfig extends Configuration {

  @NotNull
  @JsonProperty("smtp")
  private SmtpConfig smtpConfig;

  @NotNull
  @JsonProperty
  private String fromAddress;

  @NotNull
  @JsonProperty
  private String fromName;

  @NotNull
  @JsonProperty
  private String passwordResetSubject;

  @NotNull
  @JsonProperty
  private String passwordResetText;

  @NotNull
  @JsonProperty
  private float passwordResetTokenValidityInMinutes;

  public SmtpConfig getSmtpConfig() {
    return smtpConfig;
  }

  public String getFromAddress() {
    return fromAddress;
  }

  public String getPasswordResetSubject() {
    return passwordResetSubject;
  }

  public String getPasswordResetText() {
    return passwordResetText;
  }

  public String getFromName() {
    return fromName;
  }

  public float getPasswordResetTokenValidityInMinutes() {
    return passwordResetTokenValidityInMinutes;
  }
}
