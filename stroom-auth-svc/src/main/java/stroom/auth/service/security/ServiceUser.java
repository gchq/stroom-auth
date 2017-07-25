package stroom.auth.service.security;

import java.security.Principal;

import com.google.common.base.Preconditions;
import org.jetbrains.annotations.NotNull;

public final class ServiceUser implements Principal {

  @NotNull
  private String name;
  @NotNull
  private final String jwt;

  @NotNull
  public String getName() {
    return this.name;
  }

  @NotNull
  public final String getJwt() {
    return this.jwt;
  }

  public ServiceUser(@NotNull String name, @NotNull String jwt) {
    Preconditions.checkNotNull(name);
    Preconditions.checkNotNull(jwt);
    this.name = name;
    this.jwt = jwt;
  }
}
