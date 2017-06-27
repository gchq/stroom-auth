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

package stroom.auth.service.security

import io.dropwizard.auth.AuthenticationException
import io.dropwizard.auth.Authenticator
import org.jose4j.jwt.MalformedClaimException
import org.jose4j.jwt.consumer.JwtContext

import java.util.Optional

class UserAuthenticator : Authenticator<JwtContext, ServiceUser> {

    @Throws(AuthenticationException::class)
    override fun authenticate(context: JwtContext): Optional<ServiceUser> {
        //TODO: If we want to check anything else about the user we need to do it here.
        try {
            return Optional.of(ServiceUser(
                    context.jwtClaims.subject,
                    context.jwt))
        } catch (e: MalformedClaimException) {
            return Optional.empty()
        }

    }
}

