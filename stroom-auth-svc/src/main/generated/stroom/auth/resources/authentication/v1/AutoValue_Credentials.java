
package stroom.auth.resources.authentication.v1;

import javax.annotation.Generated;

@Generated("com.google.auto.value.processor.AutoValueProcessor")
 final class AutoValue_Credentials extends Credentials {

  private final String email;
  private final String password;
  private final String sessionId;
  private final String requestingClientId;

  AutoValue_Credentials(
      String email,
      String password,
      String sessionId,
      String requestingClientId) {
    if (email == null) {
      throw new NullPointerException("Null email");
    }
    this.email = email;
    if (password == null) {
      throw new NullPointerException("Null password");
    }
    this.password = password;
    if (sessionId == null) {
      throw new NullPointerException("Null sessionId");
    }
    this.sessionId = sessionId;
    if (requestingClientId == null) {
      throw new NullPointerException("Null requestingClientId");
    }
    this.requestingClientId = requestingClientId;
  }

  @Override
  public String email() {
    return email;
  }

  @Override
  public String password() {
    return password;
  }

  @Override
  public String sessionId() {
    return sessionId;
  }

  @Override
  public String requestingClientId() {
    return requestingClientId;
  }

  @Override
  public String toString() {
    return "Credentials{"
        + "email=" + email + ", "
        + "password=" + password + ", "
        + "sessionId=" + sessionId + ", "
        + "requestingClientId=" + requestingClientId
        + "}";
  }

  @Override
  public boolean equals(Object o) {
    if (o == this) {
      return true;
    }
    if (o instanceof Credentials) {
      Credentials that = (Credentials) o;
      return (this.email.equals(that.email()))
           && (this.password.equals(that.password()))
           && (this.sessionId.equals(that.sessionId()))
           && (this.requestingClientId.equals(that.requestingClientId()));
    }
    return false;
  }

  @Override
  public int hashCode() {
    int h = 1;
    h *= 1000003;
    h ^= this.email.hashCode();
    h *= 1000003;
    h ^= this.password.hashCode();
    h *= 1000003;
    h ^= this.sessionId.hashCode();
    h *= 1000003;
    h ^= this.requestingClientId.hashCode();
    return h;
  }

}
