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

package stroom.auth.svc

import jersey.repackaged.com.google.common.base.Throwables
import org.jose4j.jws.AlgorithmIdentifiers.HMAC_SHA256
import org.jose4j.jws.JsonWebSignature
import org.jose4j.jwt.JwtClaims
import org.jose4j.keys.HmacKey
import org.jose4j.lang.JoseException
import java.nio.charset.Charset
import javax.inject.Singleton
import javax.inject.Inject

@Singleton
class TokenGenerator @Inject constructor (config: Config) {
    private var config: Config = config

    fun getToken(user: String): String {
        return toToken(
                config.jwsSecret.toByteArray(Charset.defaultCharset()),
                getClaimsForUser(user))
    }

    private fun toToken(key: ByteArray, claims: JwtClaims): String {
        val jws = JsonWebSignature()
        jws.payload = claims.toJson()
        jws.algorithmHeaderValue = HMAC_SHA256
        jws.key = HmacKey(key)
        jws.isDoKeyValidation = false

        try {
            return jws.compactSerialization
        } catch (e: JoseException) {
            throw Throwables.propagate(e)
        }
    }

    private fun getClaimsForUser(user: String): JwtClaims {
        val claims = JwtClaims()
        claims.setExpirationTimeMinutesInTheFuture(config.jwsExpirationTimeInMinutesInTheFuture)
        claims.subject = user
        claims.issuer = config.jwsIssuer
        return claims
    }
}