package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.resources.token.v1.Token;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.service.resources.support.HttpAsserts.assertBadRequest;
import static stroom.auth.service.resources.support.HttpAsserts.assertOk;

public class TokenResource_create_IT extends TokenResource_IT {

  @Test
  public void simpleCreate() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    String expiresOn = Instant.now().plusSeconds(604800).toString();
    String issuedOn = Instant.now().toString();

    Token token = new Token.TokenBuilder()
        .token(securityToken)
        .tokenType(Token.TokenType.API.getText())
        .enabled(true)
        .expiresOn(expiresOn)
        .issuedOn(issuedOn)
        .userEmail("admin")
        .build();

    int id = tokenManager.createToken(token, securityToken);

    HttpResponse response = Unirest
        .get(url + "/" + id)
        .header("Authorization", "Bearer " + securityToken)
        .header("Content-Type", "application/json")
        .asString();

    assertOk(response);
    List<Token> tokens = tokenManager.deserialiseTokens((String)response.getBody());
    assertThat(tokens.size()).isGreaterThan(0);
  }

  @Test
  public void create_with_bad_user() throws UnirestException, IOException {
    String securityToken = clearTokensAndLogin();

    String expiresOn = Instant.now().plusSeconds(604800).toString();
    String issuedOn = Instant.now().toString();

    Token token = new Token.TokenBuilder()
        .token(securityToken)
        .tokenType(Token.TokenType.API.getText())
        .enabled(true)
        .expiresOn(expiresOn)
        .issuedOn(issuedOn)
        .userEmail("badUser")
        .build();

    String serializedToken = tokenManager.serialiseToken(token);

    HttpResponse response = Unirest
        .post(tokenManager.getRootUrl())
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + securityToken)
        .body(serializedToken)
        .asString();

    assertBadRequest(response);
  }
}
