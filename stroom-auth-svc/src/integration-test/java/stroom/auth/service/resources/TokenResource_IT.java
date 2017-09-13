package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.time.Instant;

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

  protected void createUserAndTokens(String userEmail, String jwsToken) throws UnirestException {
    userManager.createUser(new User(userEmail, "password"), jwsToken);
    createToken(jwsToken, userEmail, Token.TokenType.USER);
    createToken(jwsToken, userEmail, Token.TokenType.API);
  }

  protected void createToken(String jwsToken, String userEmail, Token.TokenType tokenType) throws UnirestException {
    Token token = new Token.TokenBuilder()
        .token(jwsToken)
        .tokenType(tokenType.getText())
        .enabled(true)
        .expiresOn(Instant.now().plusSeconds(604800).toString())
        .issuedOn(Instant.now().toString())
        .userEmail(userEmail)
        .build();

    int id = tokenManager.createToken(token, jwsToken);
  }
}
