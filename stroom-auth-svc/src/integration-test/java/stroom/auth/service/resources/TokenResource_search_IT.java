package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.assertj.core.api.Condition;
import org.junit.Test;
import stroom.auth.service.resources.token.v1.SearchRequest;
import stroom.auth.service.resources.token.v1.Token;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Sets.newLinkedHashSet;
import static stroom.auth.service.resources.support.HttpAsserts.assertOk;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnprocessableEntity;

public class TokenResource_search_IT extends TokenResource_IT {

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
        .post(searchUrl)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
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
    Token.TokenType expectedType = Token.TokenType.API;

    String securityToken = clearTokensAndLogin();
    createUserAndTokens("user1" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5" + Instant.now().toString(), securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(5)
        .orderBy("token_type")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
    assertThat(results.size()).isEqualTo(5);
    assertThat(response.getStatus()).isEqualTo(200);

    results.forEach(result ->
        assertThat(result.getToken_type()).isEqualTo(expectedType.getText()));
  }

  @Test
  public void search_ordering_by_token_type_asc() throws UnirestException, IOException {
    Token.TokenType expectedType = Token.TokenType.API;

    String securityToken = clearTokensAndLogin();
    createUserAndTokens("user1" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5" + Instant.now().toString(), securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(5)
        .orderBy("token_type")
        .orderDirection("asc")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();

    assertThat(results.size()).isEqualTo(5);
    assertThat(response.getStatus()).isEqualTo(200);

    results.forEach(result ->
        assertThat(result.getToken_type().toLowerCase()).isEqualTo(expectedType.getText().toLowerCase()));
  }

  @Test
  public void search_ordering_by_token_type_desc() throws UnirestException, IOException {
    Token.TokenType expectedType = Token.TokenType.USER;

    String securityToken = clearTokensAndLogin();
    createUserAndTokens("user1" + Instant.now().toString(), securityToken);
    createUserAndTokens("user2" + Instant.now().toString(), securityToken);
    createUserAndTokens("user3" + Instant.now().toString(), securityToken);
    createUserAndTokens("user4" + Instant.now().toString(), securityToken);
    createUserAndTokens("user5" + Instant.now().toString(), securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(5)
        .orderBy("token_type")
        .orderDirection("desc")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();

    assertThat(results.size()).isEqualTo(5);
    assertThat(response.getStatus()).isEqualTo(200);

    results.forEach(result ->
        assertThat(result.getToken_type().toLowerCase()).isEqualTo(expectedType.getText().toLowerCase()));
  }

  @Test
  public void orderDirection_validity() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();
    assertOrderDirectionValidity("BAD", false, securityToken);
    assertOrderDirectionValidity("ascc", false, securityToken);
    assertOrderDirectionValidity("aasc", false, securityToken);
    assertOrderDirectionValidity("descc", false, securityToken);
    assertOrderDirectionValidity("ddesc", false, securityToken);

    assertOrderDirectionValidity("asc", true, securityToken);
    assertOrderDirectionValidity("desc", true, securityToken);
  }

  @Test
  public void orderBy_validity() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    // Bad orderBy values
    assertOrderByValidity("BAD", false, securityToken);
    assertOrderByValidity("enabledd", false, securityToken);
    assertOrderByValidity("aenabled", false, securityToken);
    assertOrderByValidity("user_emaila", false, securityToken);
    assertOrderByValidity("auser_email", false, securityToken);
    assertOrderByValidity("issued_by_usera", false, securityToken);
    assertOrderByValidity("jissued_by_user", false, securityToken);
    assertOrderByValidity("tokene", false, securityToken);
    assertOrderByValidity("etoken", false, securityToken);
    assertOrderByValidity("token_typea", false, securityToken);
    assertOrderByValidity("otoken_type", false, securityToken);
    assertOrderByValidity("updated_by_userj", false, securityToken);
    assertOrderByValidity("qupdated_by_user", false, securityToken);

    // Valid orderBy values
    assertOrderByValidity("enabled", true, securityToken);
    assertOrderByValidity("user_email", true, securityToken);
    assertOrderByValidity("issued_by_user", true, securityToken);
    assertOrderByValidity("token", true, securityToken);
    assertOrderByValidity("token_type", true, securityToken);
    assertOrderByValidity("updated_by_user", true, securityToken);
    assertOrderByValidity("expires_on", true, securityToken);
    assertOrderByValidity("issued_on", true, securityToken);
    assertOrderByValidity("updated_on", true, securityToken);
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
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest )
        .asString();

    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
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
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
    assertThat(results.size()).isEqualTo(6);
    results.forEach(result -> {
      assertThat(result.getUser_email()).contains("user1");
    });
  }

  @Test
  public void search_on_validity() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    assertFilterValidity("bad", false, securityToken);
    assertFilterValidity("expires_on", false, securityToken);
    assertFilterValidity("issued_on", false, securityToken);
    assertFilterValidity("updated_on", false, securityToken);

    assertFilterValidity("enabled", true, securityToken);
    assertFilterValidity("user_email", true, securityToken);
    assertFilterValidity("issued_by_user", true, securityToken);
    assertFilterValidity("token", true, securityToken);
    assertFilterValidity("token_type", true, securityToken);
    assertFilterValidity("updated_by_user", true, securityToken);
  }

  private void getPageAndAssert(int page, int limit, int expectedCount, String jwsToken) throws UnirestException, IOException {
    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .limit(limit)
        .page(page)
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + jwsToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest )
        .asString();

    List<Token> results = tokenManager.deserialiseTokens((String)response.getBody()).getResults();
    assertThat(results.size()).isEqualTo(expectedCount);
    assertThat(response.getStatus()).isEqualTo(200);
  }

  private void assertOrderDirectionValidity(String orderDirection, boolean isValid, String securityToken) throws UnirestException {
    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(5)
        .orderBy("enabled")
        .orderDirection(orderDirection)
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    if(isValid) {
      assertOk(response);
    }
    else{
      assertUnprocessableEntity(response);
    }
  }

  private void assertOrderByValidity(String orderBy, boolean isValid, String securityToken) throws UnirestException {
    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(5)
        .orderBy(orderBy)
        .orderDirection("asc")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    if(isValid) {
      assertOk(response);
    }
    else{
      assertUnprocessableEntity(response);
    }
  }

  private void assertFilterValidity(String filterOn, boolean isValid, String securityToken) throws UnirestException {
    Map<String, String> filters = new HashMap<>();
    filters.put(filterOn, "something");
    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .filters(filters)
        .limit(10)
        .orderBy("expires_on")
        .page(0)
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    if(isValid) {
      assertOk(response);
    }
    else{
      Condition<Integer> invalidResponseCodes = new Condition<>(newLinkedHashSet(400, 422)::contains, "Invalid response codes");
      assertThat(response.getStatus()).is(invalidResponseCodes);
    }
  }
}
