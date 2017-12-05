/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.jose4j.lang.JoseException;
import org.junit.Test;
import stroom.auth.AuthenticationFlowHelper;
import stroom.auth.resources.user.v1.User;
import stroom.auth.service.ApiException;
import stroom.auth.service.ApiResponse;
import stroom.auth.service.api.UserApi;
import stroom.auth.service.resources.support.Base_IT;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Java6Assertions.fail;

public final class UserResource_read_IT extends Base_IT {

    @Test
    public final void search_users() throws UnirestException, IOException, ApiException, JoseException {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());
        ApiResponse<String> response = userApi.getAllWithHttpInfo();
        assertThat(response.getStatusCode()).isEqualTo(200);
    }

    @Test
    public final void read_current_user() throws UnirestException, IOException, InterruptedException, ApiException, JoseException {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());
        ApiResponse<String> response = userApi.readCurrentUserWithHttpInfo();
        List<User> user = userManager.deserialiseUsers(response.getData());

        if (user != null) {
            assertThat(user.get(0).getEmail()).isEqualTo("admin");
        } else fail("No users found");
        assertThat(response.getStatusCode()).isEqualTo(200);
    }

    @Test
    public final void read_user_that_doesnt_exist() throws UnirestException, ApiException, JoseException {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());
        try {
            userApi.getUser(129387298);
            fail("Expected a 404 exception!");
        }catch(ApiException e) {
            assertThat(e.getCode()).isEqualTo(404);
        }
    }

    @Test
    public final void read_other_user_with_authorisation() throws UnirestException, ApiException, JoseException {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());

        ApiResponse<Integer> response = userApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
            .email("read_other_user_with_authorisation_" + UUID.randomUUID().toString())
            .password("password"));
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getData()).isNotNull();

        String user = userApi.getUser(response.getData());
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getData()).isNotNull();
    }

    @Test
    public final void read_other_user_without_authorisation() throws UnirestException, ApiException, JoseException {
        UserApi adminUserApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());

        String userEmailA = "userEmailA_" + UUID.randomUUID().toString();
        ApiResponse<Integer> responseA = adminUserApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
                .email(userEmailA)
                .password("password"));

        String userEmailB = "userEmailB_" + UUID.randomUUID().toString();
        ApiResponse<Integer> responseB = adminUserApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
                .email(userEmailB)
                .password("password"));

        UserApi userApiA = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAs(userEmailA, "password"));
        try {
            userApiA.getUser(responseB.getData());
            fail("Expected a 401!");
        } catch(ApiException e){
            assertThat(e.getCode()).isEqualTo(401);
        }
    }

}
