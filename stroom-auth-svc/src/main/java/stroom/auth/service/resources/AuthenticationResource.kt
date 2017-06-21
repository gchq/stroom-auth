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

package stroom.auth.service.resources

import com.codahale.metrics.annotation.Timed
import org.jooq.DSLContext
import org.mindrot.jbcrypt.BCrypt
import org.slf4j.LoggerFactory
import stroom.auth.service.Config
import stroom.auth.service.TokenGenerator
import stroom.auth.service.security.CertificateUtil
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType

import stroom.db.auth.Tables.*
import java.net.URI
import java.util.regex.Pattern
import javax.servlet.http.HttpServletRequest
import javax.ws.rs.*
import javax.ws.rs.core.Response

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
class AuthenticationResource(
        tokenGenerator : TokenGenerator,
        config: Config) {
    private var tokenGenerator: TokenGenerator = tokenGenerator
    private var config: Config = config
    private val dnPattern: Pattern = Pattern.compile(config.certificateDnPattern)
    private val redirectToLoginResponse = Response.seeOther(URI(config.loginUrl)).build()

    private val LOGGER = LoggerFactory.getLogger(AuthenticationResource::class.java)

    @GET
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    fun welcome(): Response {
        return Response
                .status(Response.Status.OK)
                .entity("Welcome to the authentication service")
                .build()
    }

    @GET
    @Path("/checkCertificate")
    @Timed
    fun checkCertificate(@Context httpServletRequest: HttpServletRequest,
                         @Context database: DSLContext) : Response {
        val certificateDn = CertificateUtil.extractCertificateDN(httpServletRequest)
        var response: Response
        if(certificateDn == null) {
            LOGGER.debug("No certificate in request. Redirecting to login.")
            response = redirectToLoginResponse
        }
        else {
            LOGGER.debug("Found certificate in request. DN: {}", certificateDn)
            val username = CertificateUtil.extractUserIdFromDN(certificateDn, dnPattern)
            if(username == null) {
                LOGGER.debug("Cannot extract user from certificate. Redirecting to login.")
                response = redirectToLoginResponse
            }
            else {
                var user = database
                        .selectFrom(USERS)
                        .where(USERS.NAME.eq(username))
                        .single()
                val isAuthenticated = user != null
                if (isAuthenticated) {
                    val token = tokenGenerator.getToken(username)
                    val redirectUrl = "${config.stroomUrl}/?token=$token"
                    response = Response
                            .seeOther(URI(redirectUrl))
                            .build()
                } else {
                    LOGGER.debug("Certificate does not contain a known user. Redirecting to login.")
                    response = redirectToLoginResponse
                }
            }
//            certificateAuthenticator.login(certificateDn, httpServletRequest.remoteHost)
        }
        return response
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Timed
    fun authenticateAndReturnToken(@Context database: DSLContext, credentials: Credentials): Response {
        var user = database
                .selectFrom(USERS)
                .where(USERS.NAME.eq(credentials.username))
                .single()

        val isPasswordCorrect = BCrypt.checkpw(credentials.password, user.passwordHash)

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