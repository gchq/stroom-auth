package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.AuthenticationFlowHelper;
import stroom.auth.service.ApiException;
import stroom.auth.service.api.DefaultApi;
import stroom.auth.service.api.model.SearchResponse;

import java.io.IOException;
import java.util.HashMap;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class SwaggerClient_IT extends TokenResource_IT {

    @Test
    public void search() throws UnirestException, ApiException, IOException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();

        // This should be the AuthenticationApi, but Swagger isn't putting
        // the endpoints in the right place and I'm not sure why.
        DefaultApi defaultApi = SwaggerHelper.newDefaultApiClient(idToken);

        stroom.auth.service.api.model.SearchRequest authSearchRequest = new stroom.auth.service.api.model.SearchRequest();
        authSearchRequest.setLimit(10);
        authSearchRequest.setPage(0);
        authSearchRequest.setFilters(new HashMap<String, String>() {{
            put("user_email", "admin");
            put("token_type", "api");
            put("enabled", "true");
        }});

        SearchResponse searchResponse = defaultApi.search(authSearchRequest);
        assertThat(searchResponse).isNotNull();
        // I used isGreaterThan because although we'll definitely have
        // an admin key a developer might have created another.
        assertThat(searchResponse.getTokens().size()).isGreaterThanOrEqualTo(1);
    }
}
