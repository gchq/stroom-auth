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

package stroom.auth.resources.token.v1;

import javax.annotation.Nullable;

/**
 * This POJO binds to the response from the database, and to the JSON.
 *
 * The names are database-style to reduce mapping code. This looks weird in Java but it's sensible for the database
 * and it's sensible for the json.
 */
public class Token {
  @Nullable
  private int id;

  @Nullable
  private String user_email;

  @Nullable
  private String token_type;

  @Nullable
  private String token;

  @Nullable
  private String expires_on;

  @Nullable
  private String issued_on;

  @Nullable
  private String issued_by_user;

  @Nullable
  private boolean enabled;

  @Nullable
  private String updated_on;

  @Nullable
  private String updated_by_user;

  @Nullable
  public int getId() {
    return id;
  }

  public void setId(@Nullable int id) {
    this.id = id;
  }

  @Nullable
  public String getUser_email() {
    return user_email;
  }

  public void setUser_email(@Nullable String user_email) {
    this.user_email = user_email;
  }

  @Nullable
  public String getToken_type() {
    return token_type;
  }

  public void setToken_type(@Nullable String token_type) {
    this.token_type = token_type;
  }

  @Nullable
  public String getToken() {
    return token;
  }

  public void setToken(@Nullable String token) {
    this.token = token;
  }

  @Nullable
  public String getExpires_on() {
    return expires_on;
  }

  public void setExpires_on(@Nullable String expires_on) {
    this.expires_on = expires_on;
  }

  @Nullable
  public String getIssued_on() {
    return issued_on;
  }

  public void setIssued_on(@Nullable String issued_on) {
    this.issued_on = issued_on;
  }

  @Nullable
  public String getIssued_by_user() {
    return issued_by_user;
  }

  public void setIssued_by_user(@Nullable String issued_by_user) {
    this.issued_by_user = issued_by_user;
  }

  @Nullable
  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(@Nullable boolean enabled) {
    this.enabled = enabled;
  }

  @Nullable
  public String getUpdated_on() {
    return updated_on;
  }

  public void setUpdated_on(@Nullable String updated_on) {
    this.updated_on = updated_on;
  }

  @Nullable
  public String getUpdated_by_user() {
    return updated_by_user;
  }

  public void setUpdated_by_user(@Nullable String updated_by_user) {
    this.updated_by_user = updated_by_user;
  }

  public enum TokenType {
    USER("user"),
    API("api"),
    EMAIL_RESET("email_reset");

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
      token.setUser_email(userEmail);
      token.setToken_type(tokenType);
      token.setToken(this.token);
      token.setExpires_on(expiresOn);
      token.setIssued_on(issuedOn);
      token.setIssued_by_user(issuedByUser);
      token.setEnabled(enabled);
      token.setUpdated_on(updatedOn);
      token.setUpdated_by_user(updatedByUser);
      return token;
    }
  }
}
