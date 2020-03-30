/*
 * Copyright 2020 Crown Copyright
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

package stroom.auth.service.api;

import java.util.HashSet;
import java.util.Set;

public class OIDC {
    public static final String CLIENT_ID = "client_id";
    public static final String CLIENT_SECRET = "client_secret";
    public static final String CODE = "code";
    public static final String GRANT_TYPE = "grant_type";
    public static final String NONCE = "nonce";
    public static final String PROMPT = "prompt";
    public static final String REDIRECT_URI = "redirect_uri";
    public static final String RESPONSE_TYPE = "response_type";
    public static final String SCOPE = "scope";
    public static final String STATE = "state";

    public static final String GRANT_TYPE__AUTHORIZATION_CODE = "authorization_code";
    public static final String RESPONSE_TYPE__CODE = "code";
    public static final String SCOPE__OPENID = "openid";
    public static final String SCOPE__EMAIL = "email";

    public static final String ID_TOKEN = "id_token";

    public static final Set<String> RESERVED_PARAMS;

    static {
        RESERVED_PARAMS = new HashSet<>();
        RESERVED_PARAMS.add(CLIENT_ID);
        RESERVED_PARAMS.add(CLIENT_SECRET);
        RESERVED_PARAMS.add(CODE);
        RESERVED_PARAMS.add(GRANT_TYPE);
        RESERVED_PARAMS.add(NONCE);
        RESERVED_PARAMS.add(PROMPT);
        RESERVED_PARAMS.add(REDIRECT_URI);
        RESERVED_PARAMS.add(RESPONSE_TYPE);
        RESERVED_PARAMS.add(SCOPE);
        RESERVED_PARAMS.add(STATE);
    }
}
