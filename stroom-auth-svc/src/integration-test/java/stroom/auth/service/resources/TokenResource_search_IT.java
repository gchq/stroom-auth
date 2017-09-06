package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenResource_search_IT extends Base_IT{

  private static final String SEARCH_PARAMS = "/?page=%s&limit=%s&orderBy=%s";

  @Test
  public void simple_search() throws UnirestException, IOException {
    String jwsToken = authenticationManager.loginAsAdmin();

    Token token = new Token.TokenBuilder()
        .token(jwsToken)
        .tokenType(Token.TokenType.USER.getText())
        .enabled(true)
        .expiresOn(Instant.now().plusSeconds(604800).toString())
        .issuedOn(Instant.now().toString())
        .userEmail("admin")
        .build();
    tokenManager.createToken(token, jwsToken);

    String url = getSearchUrl(0, 10, "expires_on");
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(tokens.size()).isGreaterThan(0);
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public void multipage_search() throws UnirestException, IOException {
    String jwsToken = authenticationManager.loginAsAdmin();

    tokenManager.deleteAllTokens(jwsToken);

    // We've just deleted all the tokens so we'll need to log in again.
    String refreshedToken = authenticationManager.loginAsAdmin();

    createUserAndTokens("user1" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user2" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user3" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user4" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user5" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user6" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user7" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user8" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user9" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user10" + Instant.now().toString(), refreshedToken);
    createUserAndTokens("user11" + Instant.now().toString(), refreshedToken);

    // We expect twice as many tokens as users because we're creating API tokens and user tokens.
    getPageAndAssert(0, 5, 5, refreshedToken);
    getPageAndAssert(1, 5, 5, refreshedToken);
    getPageAndAssert(2, 5, 5, refreshedToken);
    getPageAndAssert(3, 5, 5, refreshedToken);
    getPageAndAssert(4, 5, 2, refreshedToken);
  }

  private void createUserAndTokens(String userEmail, String jwsToken) throws UnirestException {
    userManager.createUser(new User(userEmail, "password"), jwsToken);
    createToken(jwsToken, userEmail, Token.TokenType.USER);
    createToken(jwsToken, userEmail, Token.TokenType.API);
  }

  private void createToken(String jwsToken, String userEmail, Token.TokenType tokenType) throws UnirestException {
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

  private void getPageAndAssert(int page, int limit, int expectedCount, String jwsToken) throws UnirestException, IOException {
    String url = getSearchUrl(page, limit, "expires_on");
    HttpResponse response = Unirest
        .get(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(results.size()).isEqualTo(expectedCount);
    assertThat(response.getStatus()).isEqualTo(200);
  }

  private static String getSearchUrl(
      int page,
      int limit,
      String orderBy){
    return String.format(
        tokenManager.getRootUrl() + SEARCH_PARAMS,
        page, limit, orderBy);
  }
}
