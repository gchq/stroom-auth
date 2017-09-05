package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import stroom.auth.service.resources.user.v1.User;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.List;

public class UserManager {
  private String rootUrl;
  private String meUrl;

  public final int createUser(User user, String jwsToken) throws UnirestException {
    String serializedUser = this.userMapper().toJson(user);
    HttpResponse response = Unirest
        .post(this.rootUrl)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .body(serializedUser)
        .asString();

    return Integer.parseInt((String) response.getBody());
  }

  public final User getUser(int userId, String jwsToken) throws UnirestException, IOException {
    String url = this.rootUrl + userId;
    HttpResponse response = Unirest
        .get(url)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .asString();

    if (response.getStatus() != 404) {
      String body = (String) response.getBody();
      List<User> users = (List<User>) userListMapper().fromJson(body);

      if (users != null) {
        return users.get(0);
      } else return null;
    } else return null;
  }

  public final List<User> parseUsers(String body) throws IOException {
    return (List<User>) userListMapper().fromJson(body);
  }

  public final String serialiseUser(User user) {
    return userMapper().toJson(user);
  }

  private final JsonAdapter userListMapper() {
    Moshi moshi = new Moshi.Builder().build();
    ParameterizedType type = Types.newParameterizedType(List.class, User.class);
    JsonAdapter<List<User>> jsonAdapter = moshi.adapter(type);
    return jsonAdapter;
  }

  private static final JsonAdapter userMapper() {
    return new Moshi.Builder().build().adapter(User.class);
  }

  public void setPort(int appPort) {
    this.rootUrl = "http://localhost:" + appPort + "/user/v1/";
    this.meUrl = "http://localhost:" + appPort + "/user/v1/me";
  }

  public String getRootUrl(){
    return this.rootUrl;
  }

  public String getMeUrl() {
    return meUrl;
  }
}
