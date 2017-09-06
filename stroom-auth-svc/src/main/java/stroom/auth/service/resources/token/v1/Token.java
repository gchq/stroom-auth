package stroom.auth.service.resources.token.v1;

import javax.annotation.Nullable;

public class Token {
  @Nullable
  private int id;

  @Nullable
  private String userEmail;

  @Nullable
  private String tokenType;

  @Nullable
  private String token;

  @Nullable
  private String expiresOn;

  @Nullable
  private String issuedOn;

  @Nullable
  private String issuedByUser;

  @Nullable
  private boolean enabled;

  @Nullable
  private String updatedOn;

  @Nullable
  private String updatedByUser;

  @Nullable
  public int getId() {
    return id;
  }

  public void setId(@Nullable int id) {
    this.id = id;
  }

  @Nullable
  public String getUserEmail() {
    return userEmail;
  }

  public void setUserEmail(@Nullable String userEmail) {
    this.userEmail = userEmail;
  }

  @Nullable
  public String getTokenType() {
    return tokenType;
  }

  public void setTokenType(@Nullable String tokenType) {
    this.tokenType = tokenType;
  }

  @Nullable
  public String getToken() {
    return token;
  }

  public void setToken(@Nullable String token) {
    this.token = token;
  }

  @Nullable
  public String getExpiresOn() {
    return expiresOn;
  }

  public void setExpiresOn(@Nullable String expiresOn) {
    this.expiresOn = expiresOn;
  }

  @Nullable
  public String getIssuedOn() {
    return issuedOn;
  }

  public void setIssuedOn(@Nullable String issuedOn) {
    this.issuedOn = issuedOn;
  }

  @Nullable
  public String getIssuedByUser() {
    return issuedByUser;
  }

  public void setIssuedByUser(@Nullable String issuedByUser) {
    this.issuedByUser = issuedByUser;
  }

  @Nullable
  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(@Nullable boolean enabled) {
    this.enabled = enabled;
  }

  @Nullable
  public String getUpdatedOn() {
    return updatedOn;
  }

  public void setUpdatedOn(@Nullable String updatedOn) {
    this.updatedOn = updatedOn;
  }

  @Nullable
  public String getUpdatedByUser() {
    return updatedByUser;
  }

  public void setUpdatedByUser(@Nullable String updatedByUser) {
    this.updatedByUser = updatedByUser;
  }

  public enum TokenType {
    USER("user"),
    API("API");

    private String tokenTypeText;

    TokenType(String tokenTypeText) {
      this.tokenTypeText = tokenTypeText;
    }

    public String getText() {
      return this.tokenTypeText;
    }
  }

  public static final class TokenBuilder {
    private int id;
    private String userEmail;
    private String tokenType;
    private String token;
    private String expiresOn;
    private String issuedOn;
    private String issuedByUser;
    private boolean enabled;
    private String updatedOn;
    private String updatedByUser;

    public TokenBuilder() {
    }

    public TokenBuilder id(int id) {
      this.id = id;
      return this;
    }

    public TokenBuilder userEmail(String userEmail) {
      this.userEmail = userEmail;
      return this;
    }

    public TokenBuilder tokenType(String tokenType) {
      this.tokenType = tokenType;
      return this;
    }

    public TokenBuilder token(String token) {
      this.token = token;
      return this;
    }

    public TokenBuilder expiresOn(String expiresOn) {
      this.expiresOn = expiresOn;
      return this;
    }

    public TokenBuilder issuedOn(String issuedOn) {
      this.issuedOn = issuedOn;
      return this;
    }

    public TokenBuilder issuedByUser(String issuedByUser) {
      this.issuedByUser = issuedByUser;
      return this;
    }

    public TokenBuilder enabled(boolean enabled) {
      this.enabled = enabled;
      return this;
    }

    public TokenBuilder updatedOn(String updatedOn) {
      this.updatedOn = updatedOn;
      return this;
    }

    public TokenBuilder updatedByUser(String updatedByUser) {
      this.updatedByUser = updatedByUser;
      return this;
    }

    public Token build() {
      Token token = new Token();
      token.setId(id);
      token.setUserEmail(userEmail);
      token.setTokenType(tokenType);
      token.setToken(this.token);
      token.setExpiresOn(expiresOn);
      token.setIssuedOn(issuedOn);
      token.setIssuedByUser(issuedByUser);
      token.setEnabled(enabled);
      token.setUpdatedOn(updatedOn);
      token.setUpdatedByUser(updatedByUser);
      return token;
    }
  }
}
