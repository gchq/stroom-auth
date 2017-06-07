/*
 * Copyright 2017 Crown Copyright
 *
 * This file is part of Stroom-Stats.
 *
 * Stroom-Stats is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Stroom-Stats is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Stroom-Stats.  If not, see <http://www.gnu.org/licenses/>.
 */

package stroom.auth.svc.resource

import com.codahale.metrics.annotation.Timed
import org.jooq.DSLContext
import org.mindrot.jbcrypt.BCrypt
import org.slf4j.LoggerFactory
import stroom.auth.svc.TokenGenerator
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType

import stroom.models.Tables.*
import javax.ws.rs.*
import javax.ws.rs.core.Response

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
class AuthenticationResource(tokenGenerator : TokenGenerator) {
    private var tokenGenerator: TokenGenerator = tokenGenerator

    private val LOGGER = LoggerFactory.getLogger(AuthenticationResource::class.java)

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    fun authenticateAndReturnToken(@Context database: DSLContext, credentials: Credentials): Response {
        var user = database
                .selectFrom(USR)
                .where(USR.NAME.eq(credentials.username))
                .single()

        val isPasswordCorrect = BCrypt.checkpw(credentials.password, user.passHash)

        if(isPasswordCorrect) {
            LOGGER.debug("Login for {} succeeded", credentials.username)
            val token = tokenGenerator.getToken(credentials.username)
            return Response
                    .status(Response.Status.OK)
                    .entity(token)
                    .build()
        }
        else {
            LOGGER.debug("Login for {} failed", credentials.username)
            return Response.status(Response.Status.UNAUTHORIZED).build()
        }

    }
}