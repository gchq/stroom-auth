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
import java.time.Instant

class UserResource_create_IT : UserResource_IT() {
    @Test
    fun create_user() {
        val jwsToken = login()
        val user = User(Instant.now().toString(), "testPassword")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertOk()
        response.assertBodyNotNull()
    }

    @Test
    fun create_user_missing_user() {
        val jwsToken = login()
        val (_, response) = ROOT_URL
                .httpPost()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertBadRequest()
    }

    @Test
    fun create_user_missing_name() {
        val jwsToken = login()
        val user = User("", "testPassword")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertBadRequest()

    }

    @Test
    fun create_user_missing_password() {
        val jwsToken = login()
        val user = User(Instant.now().toString(),  "")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertBadRequest()
    }

    @Test
    fun create_user_with_duplicate_name() {
        val jwsToken = login()
        val emailToBeReused = Instant.now().toString()
        val user = User( emailToBeReused,  "testPassword")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertOk()
        response.assertBodyNotNull()

        val duplicateUser = User( emailToBeReused, "testPassword")
        val duplicateSerializedUser = userMapper().toJson(duplicateUser)
        val (_, duplicateUserResponse) = ROOT_URL
                .httpPost()
                .body(duplicateSerializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()

        duplicateUserResponse.assertConflict()
    }
}
