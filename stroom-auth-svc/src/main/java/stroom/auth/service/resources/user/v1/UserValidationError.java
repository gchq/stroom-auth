package stroom.auth.service.resources.user.v1;


import javax.validation.constraints.NotNull;

public enum UserValidationError {
  NO_USER("Please supply a user with an email address and a password. "),
  NO_NAME("User's name cannot be empty. "),
  NO_PASSWORD("User's password cannot be empty. "),
  MISSING_ID("Please supply an ID for the user. "),
  USER_ALREADY_EXISTS("A user with this name already exists. Please try another name. ");

  @NotNull
  private final String message;

  @NotNull
  public final String getMessage() {
    return this.message;
  }

  UserValidationError(@NotNull String message) {
    this.message = message;
  }
}
