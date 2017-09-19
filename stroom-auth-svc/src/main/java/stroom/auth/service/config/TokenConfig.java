package stroom.auth.service.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.nio.charset.Charset;

public class TokenConfig {
  @Valid
  @NotNull
  @JsonProperty
  private int minutesUntilExpirationForUserToken;

  @Valid
  @NotNull
  @JsonProperty
  private int minutesUntilExpirationForApiToken;

  @Valid
  @NotNull
  @JsonProperty
  private int minutesUntilExpirationForEmailResetToken;

  @Valid
  @NotNull
  @JsonProperty
  private String jwsIssuer = "stroom";

  @Valid
  @NotNull
  @JsonProperty
  private String jwsSecret = "CHANGE_ME";

  public final byte[] getJwsSecretAsBytes() {
    return jwsSecret.getBytes(Charset.defaultCharset());
  }

  public int getMinutesUntilExpirationForUserToken() {
    return minutesUntilExpirationForUserToken;
  }

  public int getMinutesUntilExpirationForApiToken() {
    return minutesUntilExpirationForApiToken;
  }

  public int getMinutesUntilExpirationForEmailResetToken() {
    return minutesUntilExpirationForEmailResetToken;
  }

  public String getJwsIssuer() {
    return jwsIssuer;
  }


}
