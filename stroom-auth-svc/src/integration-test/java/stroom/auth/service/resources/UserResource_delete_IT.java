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
import stroom.auth.service.ApiException;
import stroom.auth.service.ApiResponse;
import stroom.auth.service.api.UserApi;
import stroom.auth.service.resources.support.Base_IT;

import java.io.IOException;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserResource_delete_IT extends Base_IT {
    @Test
    public final void delete_user() throws UnirestException, IOException, ApiException, JoseException {
        String idToken = AuthenticationFlowHelper.authenticateAsAdmin();
        UserApi userApi = SwaggerHelper.newUserApiClient(idToken);


        ApiResponse<Integer> response = userApi.createUserWithHttpInfo(new stroom.auth.service.api.model.User()
                .email("delete_user_" + UUID.randomUUID().toString())
                .password("password"));
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getData()).isNotNull();

        ApiResponse<String> deleteResponse = userApi.deleteUserWithHttpInfo(response.getData());
        assertThat(deleteResponse.getStatusCode()).isEqualTo(200);

        try {
            userApi.getUserWithHttpInfo(response.getData());
        }catch(ApiException e){
            assertThat(e.getCode()).isEqualTo(404);
        }
    }
}
