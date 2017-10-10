/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.config;

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
