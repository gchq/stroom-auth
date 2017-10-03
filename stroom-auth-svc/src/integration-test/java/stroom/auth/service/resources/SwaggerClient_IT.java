package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.service.ApiClient;
import stroom.auth.service.ApiException;
import stroom.auth.service.api.DefaultApi;
import stroom.auth.service.api.model.SearchResponse;

import java.io.IOException;
import java.util.HashMap;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static stroom.auth.service.resources.token.v1.Token.TokenType.API;

public class SwaggerClient_IT extends TokenResource_IT{

  @Test
  public void search() throws UnirestException, ApiException, IOException {
    String securityToken = clearTokensAndLogin();

    String token = tokenManager.createToken("admin", API, securityToken);

    ApiClient authServiceClient = new ApiClient();
    authServiceClient.setBasePath("http://localhost:" + appPort);
    authServiceClient.addDefaultHeader("Authorization", "Bearer " + securityToken);

    DefaultApi authServiceApi = new DefaultApi(authServiceClient);
    stroom.auth.service.api.model.SearchRequest authSearchRequest = new stroom.auth.service.api.model.SearchRequest();
    authSearchRequest.setLimit(10);
    authSearchRequest.setPage(0);
    authSearchRequest.setFilters(new HashMap<String, String>() {{
      put("user_email", "admin");
      put("token_type", "api");
      put("enabled", "true");
    }});

    SearchResponse searchResponse = authServiceApi.search(authSearchRequest);
    assertThat(searchResponse).isNotNull();
    assertThat(searchResponse.getTokens().size()).isEqualTo(1);
  }
}
