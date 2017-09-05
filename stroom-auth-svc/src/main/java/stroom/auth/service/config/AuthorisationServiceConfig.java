package stroom.auth.service.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;

public class AuthorisationServiceConfig {

  @NotNull
  @JsonProperty
  private String url;

  @NotNull
  @JsonProperty
  private String canManageUsersPath;

  @NotNull
  @JsonProperty
  private String canManageUsersPermission;

  public String getUrl() {
    return url;
  }

  public String getCanManageUsersUrl() {
    return url + canManageUsersPath;
  }

  public String getCanManageUsersPermission() {
    return canManageUsersPermission;
  }

}
