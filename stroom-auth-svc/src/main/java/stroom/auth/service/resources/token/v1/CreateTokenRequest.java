/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources.token.v1;

import stroom.auth.service.resources.token.v1.Token.TokenType;

import javax.annotation.Nullable;
import java.util.Optional;

import static stroom.auth.service.resources.token.v1.Token.TokenType.*;

public class CreateTokenRequest {

  private String userEmail;

  private String tokenType;

  @Nullable
  private boolean enabled;

  // Needed for serialisation
  public CreateTokenRequest(){}

  public CreateTokenRequest(String userEmail, String tokenType, boolean enabled){
    this.userEmail = userEmail;
    this.tokenType = tokenType;
    this.enabled = enabled;
  }

  public Optional<TokenType> getParsedTokenType(){
    switch(tokenType.toLowerCase()){
      case "api":
        return Optional.of(API);
      case "user":
        return Optional.of(USER);
      case "email_reset":
        return Optional.of(EMAIL_RESET);
      default:
        return Optional.empty();
    }
  }

  @Nullable
  public String getUserEmail() {
    return userEmail;
  }

  @Nullable
  public String getTokenType() {
    return tokenType;
  }

  public boolean isEnabled() {
    return enabled;
  }
}
