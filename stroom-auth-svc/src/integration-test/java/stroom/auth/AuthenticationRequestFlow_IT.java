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

package stroom.auth;

import org.junit.Test;
import stroom.auth.service.api.DefaultApi;

public class AuthenticationRequestFlow_IT {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(AuthenticationRequestFlow_IT.class);

    /**
     * This test is pretending to be a relying party.
     */
    @Test
    public void simpleTest(){
        StringBuilder authenticationRequestParams = new StringBuilder();
        authenticationRequestParams.append("?scope=openid");
        authenticationRequestParams.append("&response_type=code");
        authenticationRequestParams.append("&client_id=integrationTest");
        authenticationRequestParams.append("&redirect_url=NOT_GOING_TO_USE_THIS");
        authenticationRequestParams.append("&state=");
        authenticationRequestParams.append("&nonce=0123456789");

        //TODO Swagger-ise this
        String authenticationRequestUrl =
                "http://localhost:8099/authentication/v1/authenticate" + authenticationRequestParams;

        DefaultApi

        // Prepare AuthenticationRequest
        // Expect redirect
        // perform rediret action, maybe
        // Get and use access code
    }
}
