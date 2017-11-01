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

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.junit.Test;
import stroom.auth.resources.user.v1.User;
import stroom.auth.service.resources.support.Base_IT;

import java.io.IOException;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.service.resources.support.HttpAsserts.assertUnauthorised;

public final class UserResource_delete_IT extends Base_IT {
    @Test
    public final void delete_user() throws UnirestException, IOException {
        String jwsToken = authenticationManager.loginAsAdmin();
        User user = new User(Instant.now().toString(), "testPassword");
        int userId = userManager.createUser(user, jwsToken);
        String url = userManager.getRootUrl() + userId;

        HttpResponse response = Unirest
                .delete(url)
                .header("Authorization", "Bearer " + jwsToken)
                .header("Content-Type", "application/json")
                .asJson();

        User shouldBeNull = userManager.getUser(userId, jwsToken);
        assertThat(shouldBeNull).isNull();
    }

    @Test
    public final void delete_user_without_authorisation() throws UnirestException, IOException {
        String adminsJws = authenticationManager.loginAsAdmin();

        User userA = new User(Instant.now().toString(), "testPassword");
        userManager.createUser(userA, adminsJws);
        String userAJws = authenticationManager.logInAsUser(userA);

        User userB = new User(Instant.now().toString(), "testPassword");
        int userBId = userManager.createUser(userB, adminsJws);

        String url = userManager.getRootUrl() + userBId;

        HttpResponse response = Unirest
                .delete(url)
                .header("Authorization", "Bearer " + userAJws)
                .header("Content-Type", "application/json")
                .asString();

        assertUnauthorised(response);
    }
}
