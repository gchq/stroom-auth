package stroom.auth.service.resources;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;

public final class Credentials {
  @NotNull
  private String email = "";
  @NotNull
  private String password = "";

  @JsonProperty("email")
  @NotNull
  public final String getEmail() {
    return this.email;
  }

  public final void setEmail(@NotNull String email) {
    this.email = email;
  }

  @JsonProperty("password")
  @NotNull
  public final String getPassword() {
    return this.password;
  }

  public final void setPassword(@NotNull String password) {
    this.password = password;
  }
}
