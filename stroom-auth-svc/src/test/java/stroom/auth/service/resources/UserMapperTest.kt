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

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import stroom.db.auth.tables.records.UsersRecord
import java.sql.Timestamp
import kotlin.reflect.full.memberProperties

class UserMapperTest {

    @Test
    fun testMappings(){
        var usersRecord = UsersRecord()
        usersRecord.id = 1
        usersRecord.email = "email"
        usersRecord.passwordHash = "hash"
        usersRecord.state = "enabled"
        usersRecord.firstName = "first name"
        usersRecord.lastName = "last name"
        usersRecord.comments = "comments"
        usersRecord.loginFailures = 2
        usersRecord.loginCount = 4
        usersRecord.lastLogin = Timestamp(System.currentTimeMillis())
        usersRecord.updatedOn = Timestamp(System.currentTimeMillis())
        usersRecord.updatedByUser = "updating user"
        usersRecord.createdOn = Timestamp(System.currentTimeMillis())
        usersRecord.createdByUser = "creating user"

        var user = User()
        user.id = 2
        user.email = "new email"
        user.password_hash = "new hash"
        user.state = "disabled"
        user.first_name = "new first name"
        user.last_name = "new last name"
        user.comments = "new comments"
        user.login_failures = 3
        user.login_count = 5
        user.last_login = "2017-01-01T00:00:00.000Z"
        user.updated_on = "2017-01-02T00:00:00.000Z"
        user.updated_by_user = "New updating user"
        user.created_on = "2017-01-03T00:00:00.000Z"
        user.created_by_user = "New creating user"

        val updatedRecord = UserMapper.updateUserRecordWithUser(user, usersRecord)
        assertThat(updatedRecord.id).isEqualTo(2)
        assertThat(updatedRecord.email).isEqualTo("new email")
        assertThat(updatedRecord.passwordHash).isEqualTo("new hash")
        assertThat(updatedRecord.state).isEqualTo("disabled")
        assertThat(updatedRecord.firstName).isEqualTo("new first name")
        assertThat(updatedRecord.lastName).isEqualTo("new last name")
        assertThat(updatedRecord.comments).isEqualTo("new comments")
        assertThat(updatedRecord.loginFailures).isEqualTo(3)
        assertThat(updatedRecord.loginCount).isEqualTo(5)
        assertThat(updatedRecord.lastLogin).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-01T00:00:00.000Z"))
        assertThat(updatedRecord.updatedOn).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-02T00:00:00.000Z"))
        assertThat(updatedRecord.updatedByUser).isEqualTo("New updating user")
        assertThat(updatedRecord.createdOn).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-03T00:00:00.000Z"))
        assertThat(updatedRecord.createdByUser).isEqualTo("New creating user")
    }

    @Test
    fun updateReminder() {
        // This test will fail if you add a property to the Users class.
        // To make it pass you'll need to updated the count, below.
        // It exists to remind you to add a mapping in UserMapper.
        // The count is one more than the number in UserRecord, because it has a 'password' property.
        val currentNumberOfPropertiesOnUser = 15
        assertThat(User::class.memberProperties.size).isEqualTo(currentNumberOfPropertiesOnUser)
    }
}