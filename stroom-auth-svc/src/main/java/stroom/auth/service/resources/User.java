package stroom.auth.service.resources;

import com.google.common.base.Strings;
import org.apache.commons.lang3.tuple.Pair;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;

public final class User {
  @Nullable
  private Integer id;
  @Nullable
  private String first_name;
  @Nullable
  private String last_name;
  @Nullable
  private String comments;
  @Nullable
  private String email;
  @Nullable
  private String state;
  @Nullable
  private String password;
  @Nullable
  private String password_hash;
  @Nullable
  private Integer login_failures;
  @Nullable
  private Integer login_count;
  @Nullable
  private String last_login;
  @Nullable
  private String updated_on;
  @Nullable
  private String updated_by_user;
  @Nullable
  private String created_on;
  @Nullable
  private String created_by_user;

  @Nullable
  public final Integer getId() {
    return this.id;
  }

  public final void setId(@Nullable Integer var1) {
    this.id = var1;
  }

  @Nullable
  public final String getFirst_name() {
    return this.first_name;
  }

  public final void setFirst_name(@Nullable String var1) {
    this.first_name = var1;
  }

  @Nullable
  public final String getLast_name() {
    return this.last_name;
  }

  public final void setLast_name(@Nullable String var1) {
    this.last_name = var1;
  }

  @Nullable
  public final String getComments() {
    return this.comments;
  }

  public final void setComments(@Nullable String var1) {
    this.comments = var1;
  }

  @Nullable
  public final String getEmail() {
    return this.email;
  }

  public final void setEmail(@Nullable String var1) {
    this.email = var1;
  }

  @Nullable
  public final String getState() {
    return this.state;
  }

  public final void setState(@Nullable String var1) {
    this.state = var1;
  }

  @Nullable
  public final String getPassword() {
    return this.password;
  }

  public final void setPassword(@Nullable String var1) {
    this.password = var1;
  }

  @Nullable
  public final String getPassword_hash() {
    return this.password_hash;
  }

  public final void setPassword_hash(@Nullable String var1) {
    this.password_hash = var1;
  }

  @Nullable
  public final Integer getLogin_failures() {
    return this.login_failures;
  }

  public final void setLogin_failures(@Nullable Integer var1) {
    this.login_failures = var1;
  }

  @Nullable
  public final Integer getLogin_count() {
    return this.login_count;
  }

  public final void setLogin_count(@Nullable Integer var1) {
    this.login_count = var1;
  }

  @Nullable
  public final String getLast_login() {
    return this.last_login;
  }

  public final void setLast_login(@Nullable String var1) {
    this.last_login = var1;
  }

  @Nullable
  public final String getUpdated_on() {
    return this.updated_on;
  }

  public final void setUpdated_on(@Nullable String var1) {
    this.updated_on = var1;
  }

  @Nullable
  public final String getUpdated_by_user() {
    return this.updated_by_user;
  }

  public final void setUpdated_by_user(@Nullable String var1) {
    this.updated_by_user = var1;
  }

  @Nullable
  public final String getCreated_on() {
    return this.created_on;
  }

  public final void setCreated_on(@Nullable String var1) {
    this.created_on = var1;
  }

  @Nullable
  public final String getCreated_by_user() {
    return this.created_by_user;
  }

  public final void setCreated_by_user(@Nullable String var1) {
    this.created_by_user = var1;
  }

  public User() {
  }

  public User(@NotNull String email, @NotNull String password) {
    this.email = email;
    this.password = password;
  }

  public static Pair<Boolean, String> isValidForCreate(User user){
    ArrayList<UserValidationError> validationErrors = new ArrayList<>();

    if(user == null) {
      validationErrors.add(UserValidationError.NO_USER);
    }
    else {
      if (Strings.isNullOrEmpty(user.getEmail())) {
        validationErrors.add(UserValidationError.NO_NAME);
      }

      if (Strings.isNullOrEmpty(user.getPassword())) {
        validationErrors.add(UserValidationError.NO_PASSWORD);
      }
    }

    String validationMessages = validationErrors.stream()
        .map(validationError -> validationError.getMessage())
        .reduce((validationMessage1, validationMessage2) -> validationMessage1 + validationMessage2).orElse("");
    boolean isValid = validationErrors.size() == 0;
    return Pair.of(isValid, validationMessages);
  }
}
