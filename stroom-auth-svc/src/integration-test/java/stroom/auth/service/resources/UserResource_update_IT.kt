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

import com.github.kittinunf.fuel.httpPut
import org.assertj.core.api.Assertions
import org.junit.Test
import java.time.Instant

class UserResource_update_IT : UserResource_IT() {

    @Test
    fun update_user() {
        val jwsToken = login()
        val user = User(email = Instant.now().toString(), password = "testPassword")

        // First create a user to update
        var userId = createUser(user, jwsToken)
        user.email = "New email" + Instant.now().toString()
        val serialisedUser = userMapper().toJson(user)

        val url = ROOT_URL + userId
        val (_, updateResponse) = url
                .httpPut()
                .body(serialisedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        updateResponse.assertOk()

        var updatedUser = getUser(userId, jwsToken)
        Assertions.assertThat(updatedUser?.email).isEqualTo(user.email)
    }

    //TODO add additional update user tests, e.g. validation issues

}
