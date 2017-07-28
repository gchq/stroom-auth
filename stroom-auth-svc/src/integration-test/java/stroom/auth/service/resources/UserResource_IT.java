package stroom.auth.service.resources;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.List;

public class UserResource_IT extends Base_IT {
  protected final String ROOT_URL;
  protected final String ME_URL;

  public UserResource_IT() {
    ROOT_URL = "http://localhost:" + appPort + "/user/";
    ME_URL = "http://localhost:" + appPort + "/user/me";
  }

  protected final int createUser(User user, String jwsToken) throws UnirestException {
    String serializedUser = this.userMapper().toJson(user);
    HttpResponse response = Unirest
        .post(ROOT_URL)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .body(serializedUser)
        .asString();

    return Integer.parseInt((String)response.getBody());
  }

  protected final User getUser(int userId, String jwsToken) throws UnirestException, IOException {
    String url = this.ROOT_URL + userId;
    HttpResponse response = Unirest
        .get(url)
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + jwsToken)
        .asString();

    if(response.getStatus() != 404) {
      String body = (String)response.getBody();
      List<User> users = (List<User>)userListMapper().fromJson(body);

      if(users != null){
        return users.get(0);
      }
      else return null;
    }
    else return null;
  }

  protected final JsonAdapter userListMapper() {
    Moshi moshi = new Moshi.Builder().build();
    ParameterizedType type = Types.newParameterizedType(List.class, User.class);
    JsonAdapter<List<User>> jsonAdapter = moshi.adapter(type);
    return jsonAdapter;
  }

  protected final JsonAdapter userMapper() {
    return new Moshi.Builder().build().adapter(User.class);
  }

}
