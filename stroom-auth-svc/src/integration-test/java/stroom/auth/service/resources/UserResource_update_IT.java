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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserResource_update_IT extends Base_IT {
    @Test
    public final void update_user() throws Exception {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());

        ApiResponse<Integer> response = userApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
                .email("update_user_" + UUID.randomUUID().toString())
                .password("password"));

        User user = userManager.deserialiseUsers(userApi.getUser(response.getData())).get(0);

        user.setEmail("new email_" + UUID.randomUUID().toString());

        userApi.updateUser(response.getData(), new stroom.auth.service.api.model.User()
            .id(user.getId())
            .email(user.getEmail()));

        User updatedUser = userManager.deserialiseUsers(userApi.getUser(response.getData())).get(0);

        assertThat(updatedUser.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public final void update_self_basic_user() throws Exception {
        UserApi userApi = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAsAdmin());

        String userEmailA = "update_user_" + UUID.randomUUID().toString();
        ApiResponse<Integer> response = userApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
                .email(userEmailA)
                .password("password"));

        User userA = userManager.deserialiseUsers(userApi.getUser(response.getData())).get(0);
        userA.setComments("Updated user");
        UserApi userApiA = SwaggerHelper.newUserApiClient(AuthenticationFlowHelper.authenticateAs(userEmailA, "password"));
        ApiResponse<String> userUpdateResponse = userApiA.updateUserWithHttpInfo(response.getData(), new stroom.auth.service.api.model.User()
                .id(userA.getId())
                .comments(userA.getComments()));

        assertThat(userUpdateResponse.getStatusCode()).isEqualTo(200);

        User updatedUser = userManager.deserialiseUsers(userApi.getUser(response.getData())).get(0);
        assertThat(updatedUser.getComments()).isEqualTo("Updated user");
    }
}
