package stroom.auth.service.resources.support;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import org.eclipse.jetty.http.HttpStatus;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

public class TokenManager {
  private String rootUrl;

  public final int createToken(Token token, String jwsToken) throws UnirestException {
    String serializedToken = serialiseToken(token);

    HttpResponse response = Unirest
        .post(this.rootUrl)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .body(serializedToken)
        .asString();

    return Integer.parseInt((String) response.getBody());
  }

  public final void deleteAllTokens(String jwsToken) throws UnirestException {
    HttpResponse response = Unirest
        .delete(this.rootUrl)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .asString();
    assertThat(response.getStatus()).isEqualTo(HttpStatus.OK_200);
  }

  public final List<Token> deserialiseTokens(String body) throws IOException {
    return (List<Token>) tokenListMapper().fromJson(body);
  }

  public final String serialiseToken(Token token) {
    return new Moshi.Builder().build().adapter(Token.class).toJson(token);
  }

  public void setPort(int appPort) {
    this.rootUrl = "http://localhost:" + appPort + "/token/v1";
  }

  public String getRootUrl() {
    return rootUrl;
  }

  private final JsonAdapter tokenListMapper() {
    Moshi moshi = new Moshi.Builder().build();
    ParameterizedType type = Types.newParameterizedType(List.class, Token.class);
    JsonAdapter<List<User>> jsonAdapter = moshi.adapter(type);
    return jsonAdapter;
  }
}
