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
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.fuel.httpPut
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import com.squareup.moshi.Moshi
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Types
import org.assertj.core.api.Assertions.fail
import java.lang.reflect.Type
import java.time.Instant


/**
 * This class expects the admin user to exist, and have the default password.
 */
class UserResource_IT: Base_IT() {

    private var ROOT_URL = "http://localhost:$appPort/users/"
    private var ME_URL = "http://localhost:$appPort/users/me"

    @Test
    fun search_users() {
        val jwsToken = login()
        val url = ROOT_URL + "?fromUsername=&usersPerPage=10&orderBy=name"
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
            assertThat(user[0].name).isEqualTo("admin")
        }
        else fail("No users found")
    }

    @Test
    fun create_user() {
        val jwsToken = login()
        val user = User(name = Instant.now().toString(), password = "testPassword")
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
        val user = User("", password = "testPassword")
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
        val user = User(name = Instant.now().toString(), password = "")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertBadRequest()
    }


    @Test
    fun update_user() {
        val jwsToken = login()
        val user = User(name = Instant.now().toString(), password = "testPassword")

        // First create a user to update
        var userId = createUser(user, jwsToken)
        user.name = "New name"
        val serialisedUser = userMapper().toJson(user)

        val url = ROOT_URL + userId
        val (_, updateResponse) = url
                .httpPut()
                .body(serialisedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        updateResponse.assertOk()

        var updatedUser = getUser(userId, jwsToken)
        assertThat(updatedUser?.name).isEqualTo("New name")
    }

    private fun createUser(user: User, jwsToken: String): Int {
        val serializedUser = userMapper().toJson(user)
        val (_, creationResponse) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        return Integer.parseInt(String(creationResponse.data))
    }

    private fun getUser(userId: Int, jwsToken: String) : User? {
        val url = ROOT_URL + userId
        val (_, response) = url
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        val userJson = String(response.data)
        val users = userListMapper().fromJson(userJson)
        if(users != null) {
            return users[0]
        }
        else return null
    }

    private fun userListMapper(): JsonAdapter<List<User>> {
        val moshi = Moshi.Builder().build()
        val type: Type = Types.newParameterizedType(List::class.java, User::class.java)
        val jsonAdapter: JsonAdapter<List<User>> = moshi.adapter(type)
        return jsonAdapter
    }

    private fun userMapper(): JsonAdapter<User> {
        return Moshi.Builder().build().adapter(User::class.java)
    }

}