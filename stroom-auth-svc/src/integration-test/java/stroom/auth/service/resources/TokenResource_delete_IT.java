package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.token.v1.SearchRequest;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenResource_delete_IT extends TokenResource_IT{

  @Test
  public void delete() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();
    String userEmail = "testUser_" + Instant.now().toString();
    userManager.createUser(new User(userEmail, "password"), securityToken);
    int id1 = createToken(securityToken, userEmail, Token.TokenType.USER);
    createToken(securityToken, userEmail, Token.TokenType.API);
    createToken(securityToken, userEmail, Token.TokenType.API);
    tokenManager.deleteToken(id1, securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(10)
        .orderBy("expires_on")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();

    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(tokens.size()).isEqualTo(2);
  }

  @Test
  public void deleteAll() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();
    String userEmail = "testUser_" + Instant.now().toString();
    createUserAndTokens(userEmail, securityToken);
    tokenManager.deleteAllTokens(securityToken);

    SearchRequest searchRequest = new SearchRequest.SearchRequestBuilder()
        .page(0)
        .limit(10)
        .orderBy("expires_on")
        .build();
    String serialisedSearchRequest = tokenManager.serialiseSearchRequest(searchRequest);

    HttpResponse response = Unirest
        .post(searchUrl)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .body(serialisedSearchRequest)
        .asString();
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(tokens.size()).isEqualTo(0);
  }

}
