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

import com.github.kittinunf.fuel.core.Response
import com.github.kittinunf.fuel.httpPost
import io.dropwizard.testing.junit.DropwizardAppRule
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.BeforeClass
import org.junit.ClassRule
import org.slf4j.LoggerFactory
import stroom.auth.service.App

open abstract class Base_IT {
    companion object {
        private val LOGGER = LoggerFactory.getLogger(Base_IT::class.java)

        @ClassRule @JvmField val appRule = DropwizardAppRule(App::class.java, "config.yml")
        val JSON_CONTENT_TYPE = mapOf("Content-Type" to "application/json")

        val app = appRule.getApplication<App>()

        // The login URL naturally belongs in AuthenticationResource_IT but it's
        // here because other services need to log in and get JWS tokens
        lateinit var LOGIN_URL: String
        lateinit var BASE_TASKS_URL: String
        lateinit var HEALTH_CHECKS_URL: String

        lateinit var appPort:String
        lateinit var adminPort:String

        @BeforeClass @JvmStatic
        fun setupClass() {
            appPort = appRule.localPort.toString()
            adminPort = appRule.adminPort.toString()
            LOGIN_URL          = "http://localhost:$appPort/authentication/login"
            BASE_TASKS_URL     = "http://localhost:$adminPort/admin/tasks/"
            HEALTH_CHECKS_URL  = "http://localhost:$adminPort/admin/healthcheck?pretty=true"
        }


        fun Response.assertUnauthorised(){
            assertThat(this.httpStatusCode).isEqualTo(401)
        }

        fun Response.assertBadRequest(){
            assertThat(this.httpStatusCode).isEqualTo(400)
        }

        fun Response.assertOk() {
            assertThat(this.httpStatusCode).isEqualTo(200)
        }

        fun Response.assertBodyNotNull() {
            val body = String(this.data)
            assertThat(body).isNotNull()
        }

        fun jsonContentType(vararg pairs: Pair<String, String>): HashMap<String, String>{
            var map = HashMap<String, String>()
            pairs.forEach { (first, second) -> map.put(first, second) }
            map.put("Content-Type", "application/json")
            return map
        }
    }

    fun login(): String {
        val (request, response, result) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"admin\", \"password\" : \"admin\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()

        LOGGER.info("Response: ${String(response.data)}")
        val jwsToken = String(response.data)
        Assertions.assertThat(response.httpStatusCode).isEqualTo(200)
        // This is the first part of the token, which doesn't change
        Assertions.assertThat(jwsToken).contains("eyJhbGciOiJIUzI1NiJ9")
        return jwsToken
    }

}

