/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.service.resources;

import stroom.auth.service.ApiClient;
import stroom.auth.service.api.ApiKeyApi;
import stroom.auth.service.api.AuthenticationApi;
import stroom.auth.service.api.DefaultApi;
import stroom.auth.service.api.SessionApi;
import stroom.auth.service.api.UserApi;

public class SwaggerHelper {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(SwaggerHelper.class);

    public static AuthenticationApi newAuthApiClient(String idToken) {
        return new AuthenticationApi(newApiClient(idToken));
    }

    public static DefaultApi newDefaultApiClient(String idToken) {
        return new DefaultApi(newApiClient(idToken));
    }

    public static ApiKeyApi newApiKeyApiClient(String idToken) {
        return new ApiKeyApi(newApiClient(idToken));
    }

    public static SessionApi newSessionApiClient(String idToken) {
        return new SessionApi(newApiClient(idToken));
    }

    public static UserApi newUserApiClient(String idToken) {
        return new UserApi(newApiClient(idToken));
    }

    private static ApiClient newApiClient(String idToken) {
        ApiClient apiClient = new ApiClient();
        apiClient.setBasePath("http://localhost:8099");
        apiClient.addDefaultHeader("Authorization", "Bearer " + idToken);
        return apiClient;
    }
}
