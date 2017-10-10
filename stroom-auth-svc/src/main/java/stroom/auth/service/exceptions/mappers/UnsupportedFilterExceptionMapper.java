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

package stroom.auth.service.exceptions.mappers;

import stroom.auth.service.exceptions.UnsupportedFilter;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

public class UnsupportedFilterExceptionMapper implements ExceptionMapper<UnsupportedFilter> {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(UnsupportedFilterExceptionMapper.class);

    @Override
    public Response toResponse(UnsupportedFilter exception) {
        LOGGER.debug(exception.getMessage());
        // 422 is UNPROCESSABLE_ENTITY - we understand the request and the request is fine but we don't support this yet
        return Response.status(422).entity(exception.getMessage()).build();
    }
}
