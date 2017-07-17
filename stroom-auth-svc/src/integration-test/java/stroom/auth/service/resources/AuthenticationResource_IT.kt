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

import com.github.kittinunf.fuel.httpPost
import org.junit.Test
import org.slf4j.LoggerFactory

/**
 * These test all expect the admin user to exist and have the default password.
 *
 * TODO: Test certificates
 */
class AuthenticationResource_IT : Base_IT() {
    private val logger = LoggerFactory.getLogger(AuthenticationResource_IT::class.java)

    var AUTHENTICATION_CHECK_CERTIFICATE_URL = "http://localhost:$appPort/authentication/checkCertificate"

    @Test
    fun good_login() {
        // Most API tests need to login so the actual login method is in the base class.
        // We're adding it as a test here for completeness.
        login()
    }

    @Test
    fun incorrect_credentials_1() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"email\" : \"BAD\", \"password\" : \"admin\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertUnauthorised()
    }

    @Test
    fun incorrect_credentials_2() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"email\" : \"admin\", \"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertUnauthorised()
    }

    @Test
    fun incorrect_credentials_3() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"email\" : \"BAD\", \"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertUnauthorised()
    }

    @Test
    fun missing_credentials_1() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"email\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertBadRequest()
    }

    @Test
    fun missing_credentials_2() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertBadRequest()
    }

    @Test
    fun missing_credentials_3() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .header(JSON_CONTENT_TYPE)
                .responseString()
        response.assertBadRequest()
    }
}
