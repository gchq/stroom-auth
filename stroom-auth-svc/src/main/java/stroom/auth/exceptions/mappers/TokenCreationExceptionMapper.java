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

package stroom.auth.exceptions.mappers;

import stroom.auth.config.Config;
import stroom.auth.exceptions.TokenCreationException;

import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import java.net.URI;
import java.net.URISyntaxException;

public class TokenCreationExceptionMapper implements ExceptionMapper<TokenCreationException> {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TokenCreationExceptionMapper.class);

    private final Config config;

    @Inject
    TokenCreationExceptionMapper(final Config config) {
        this.config = config;
    }

    @Override
    public Response toResponse(TokenCreationException exception) {
        LOGGER.debug("Unable to create a token for this user. Redirecting to login as a backup method.", exception);
        try {
            return Response.seeOther(new URI(this.config.getLoginUrl())).build();
        } catch (URISyntaxException e) {
            LOGGER.error("Unable to build a redirection from the login URL", e);
            throw new RuntimeException(e);
        }
    }
}
