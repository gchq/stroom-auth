package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.support.Base_IT;
import stroom.auth.service.resources.token.v1.SearchRequest;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenResource_search_IT extends Base_IT{

  private final String url;

  private TokenResource_search_IT() {
    url = tokenManager.getRootUrl() + "/search";
  }

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

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(10)
        .orderBy("expires_on")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(url)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(tokens.size()).isGreaterThan(0);
    assertThat(response.getStatus()).isEqualTo(200);
  }

  @Test
  public void multipage_search() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    createUserAndTokens("user1" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5" + Instant.now().toString(), securityToken);
    createUserAndTokens("user6" + Instant.now().toString(), securityToken);
    createUserAndTokens("user7" + Instant.now().toString(), securityToken);
    createUserAndTokens("user8" + Instant.now().toString(), securityToken);
    createUserAndTokens("user9" + Instant.now().toString(), securityToken);
    createUserAndTokens("user10" + Instant.now().toString(), securityToken);
    createUserAndTokens("user11" + Instant.now().toString(), securityToken);

    // We expect twice as many tokens as users because we're creating API tokens and user tokens.
    getPageAndAssert(0, 5, 5, securityToken);
    getPageAndAssert(1, 5, 5, securityToken);
    getPageAndAssert(2, 5, 5, securityToken);
    getPageAndAssert(3, 5, 5, securityToken);
    getPageAndAssert(4, 5, 2, securityToken);
  }

  @Test
  public void search_ordering_by_token_type() throws UnirestException, IOException {
    Token.TokenType expectedType = Token.TokenType.USER;

    String securityToken = orderByTokenSetup();
    String url = getSearchUrl(0, 5, "token_type_id");
    List<Token> results = orderByTokenExecute(url, securityToken);
    results.forEach(result ->
        assertThat(result.getToken_type()).isEqualTo(expectedType.getText()));
  }

  @Test
  public void search_ordering_by_token_type_desc() throws UnirestException, IOException {
    Token.TokenType expectedType = Token.TokenType.API;

    String securityToken = orderByTokenSetup();
    String url = getSearchUrl(0, 5, "token_type_id", "desc");
    List<Token> results = orderByTokenExecute(url, securityToken);
    results.forEach(result ->
        assertThat(result.getToken_type().toLowerCase()).isEqualTo(expectedType.getText().toLowerCase()));
  }

  @Test
  public void search_on_user() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    createUserAndTokens("user1_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user6_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user7_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user8_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user9_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user10_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user11_" + Instant.now().toString(), securityToken);

    Map<String, String> filters = new HashMap<>();
    filters.put("user_email", "user1");

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .filters(filters)
        .limit(10)
        .orderBy("expires_on")
        .page(0)
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(url)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest )
        .asString();

    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(results.size()).isEqualTo(6);
    results.forEach(result -> {
      assertThat(result.getUser_email()).contains("user1");
    });
  }

  @Test
  //TODO finish this
  public void search_on_enabled() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    createUserAndTokens("user1_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user6_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user7_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user8_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user9_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user10_" + Instant.now().toString(), securityToken);
    createUserAndTokens("user11_" + Instant.now().toString(), securityToken);

    String url = tokenManager.getRootUrl() + SEARCH_PARAMS;

    Map<String, String> filters = new HashMap<>();
    filters.put("user_email", "user1");

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .filters(filters)
        .limit(10)
        .orderBy("expires_on")
        .page(0)
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(url)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest )
        .asString();

    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(results.size()).isEqualTo(6);
    results.forEach(result -> {
      assertThat(result.getUser_email()).contains("user1");
    });
  }

  private String orderByTokenSetup() throws UnirestException {
    String securityToken = clearTokensAndLogin();

    createUserAndTokens("user1" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5" + Instant.now().toString(), securityToken);

    return securityToken;
  }

  private List<Token> orderByTokenExecute(String url, String securityToken) throws UnirestException, IOException {
    HttpResponse response = Unirest
        .post(url)
        .header("Authorization", "Bearer " + securityToken)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(results.size()).isEqualTo(5);
    assertThat(response.getStatus()).isEqualTo(200);

    return results;
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
        .post(url)
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(results.size()).isEqualTo(expectedCount);
    assertThat(response.getStatus()).isEqualTo(200);
  }

  private String clearTokensAndLogin() throws UnirestException {
    String jwsToken = authenticationManager.loginAsAdmin();
    tokenManager.deleteAllTokens(jwsToken);
    // We've just deleted all the tokens so we'll need to log in again.
    String refreshedToken = authenticationManager.loginAsAdmin();
    return refreshedToken;
  }

//  private static String getSearchUrl(
//      int page,
//      int limit,
//      String orderBy){
//    return String.format(
//        tokenManager.getRootUrl() + SEARCH_PARAMS,
//        page, limit, orderBy);
//  }

//  private static String getSearchUrl(
//      int page,
//      int limit,
//      String orderBy,
//      String orderDirection){
//    return String.format(
//        tokenManager.getRootUrl() + SEARCH_PARAMS_WITH_DIRECTION,
//        page, limit, orderBy, orderDirection);
//  }
}
