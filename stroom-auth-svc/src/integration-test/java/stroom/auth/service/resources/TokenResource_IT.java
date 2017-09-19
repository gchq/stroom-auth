package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;

public abstract class TokenResource_IT extends Base_IT {
  protected final String url = tokenManager.getRootUrl();
  protected final String searchUrl = tokenManager.getRootUrl() + "/search";

  protected String clearTokensAndLogin() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    tokenManager.deleteAllTokens(jwsToken);
    // We've just deleted all the tokens so we'll need to log in again.
    String refreshedToken = authenticationManager.loginAsAdmin();
    return refreshedToken;
  }

  protected void createUserAndTokens(String userEmail, String jwsToken) throws UnirestException, IOException {
    userManager.createUser(new User(userEmail, "password"), jwsToken);
    tokenManager.createToken(userEmail, Token.TokenType.USER, jwsToken);
    tokenManager.createToken(userEmail, Token.TokenType.API, jwsToken);
    tokenManager.createToken(userEmail, Token.TokenType.EMAIL_RESET, jwsToken);
  }

}
