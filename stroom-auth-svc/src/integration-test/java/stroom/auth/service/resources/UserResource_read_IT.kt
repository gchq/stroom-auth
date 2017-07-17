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

import com.github.kittinunf.fuel.httpGet
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.junit.Test


class UserResource_read_IT: UserResource_IT() {

    @Test
    fun search_users() {
        val jwsToken = login()
        val url = ROOT_URL + "?fromEmail=&usersPerPage=10&orderBy=email"
        val (_, response) = url
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        val userJson = String(response.data)
        val users = userListMapper().fromJson(userJson)
        assertThat(response.httpStatusCode).isEqualTo(200)
    }

    @Test
    fun read_current_user() {
        val jwsToken = login()
        val (_, response) = ME_URL
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(200)
        val userJson = String(response.data)

        val user = userListMapper().fromJson(userJson)

        if(user != null) {
            assertThat(user[0].email).isEqualTo("admin@")
        }
        else fail("No users found")
    }

    @Test
    fun read_user_that_doesnt_exist() {
        val jwsToken = login()
        val url = ROOT_URL + "97862345983458"
        val (_, response) = url
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(404)
    }
}