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

package stroom.auth.resources.session.v1;

import com.codahale.metrics.annotation.Timed;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import stroom.auth.SessionManager;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Singleton
@Path("/session/v1")
@Produces(MediaType.APPLICATION_JSON)
@Api(description = "Stroom Session API", tags = {"Session"})
public class SessionResource {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(SessionResource.class);

    private SessionManager sessionManager;

    @Inject
    public SessionResource(SessionManager sessionManager){
        this.sessionManager = sessionManager;
    }

    @GET
    @Path("/logout/{sessionId}")
    @Consumes({"application/json"})
    @Produces({"application/json"})
    @Timed
    @NotNull
    @ApiOperation(value = "Log a user out of their session")
    public final Response logout(@PathParam("sessionId") String sessionId){
        sessionManager.logout(sessionId);
        LOGGER.info("Logging out session {}", sessionId);
        return Response.status(Response.Status.OK).build();
    }
}
