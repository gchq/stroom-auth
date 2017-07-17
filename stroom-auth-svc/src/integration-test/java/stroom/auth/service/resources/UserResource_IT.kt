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
import com.squareup.moshi.Moshi
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Types
import java.lang.reflect.Type


/**
 * This class expects the admin user to exist, and have the default password.
 */
open class UserResource_IT: Base_IT() {

    protected var ROOT_URL = "http://localhost:$appPort/user/"
    protected var ME_URL = "http://localhost:$appPort/user/me"

    protected fun createUser(user: User, jwsToken: String): Int {
        val serializedUser = userMapper().toJson(user)
        val (_, creationResponse) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        return Integer.parseInt(String(creationResponse.data))
    }


    protected fun getUser(userId: Int, jwsToken: String) : User? {
        val url = ROOT_URL + userId
        val (_, response) = url
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        val userJson = String(response.data)
        if(response.httpStatusCode !== 404) {
            val users = userListMapper().fromJson(userJson)
            if (users != null) {
                return users[0]
            }
            else return null
        }
        else return null
    }

    protected fun userListMapper(): JsonAdapter<List<User>> {
        val moshi = Moshi.Builder().build()
        val type: Type = Types.newParameterizedType(List::class.java, User::class.java)
        val jsonAdapter: JsonAdapter<List<User>> = moshi.adapter(type)
        return jsonAdapter
    }

    protected fun userMapper(): JsonAdapter<User> {
        return Moshi.Builder().build().adapter(User::class.java)
    }

}