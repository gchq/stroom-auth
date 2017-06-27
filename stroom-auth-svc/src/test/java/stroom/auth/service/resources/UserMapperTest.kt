package stroom.auth.service.resources

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import stroom.db.auth.tables.records.UsersRecord
import java.sql.Timestamp
import kotlin.reflect.full.memberProperties

class UserMapperTest {

    @Test
    fun testMappings(){
        var usersRecord = UsersRecord(
                1,
                "name",
                null,
                "hash",
                0,
                Timestamp(System.currentTimeMillis()),
                "Creating user",
                Timestamp(System.currentTimeMillis()),
                "Updating user")

        var user = User()
        user.id = 1
        user.name = "new name"
        user.password_hash = "new hash"
        user.total_login_failures = 2
        user.last_login = "2017-01-01T00:00:00.000Z"
        user.updated_on = "2017-01-02T00:00:00.000Z"
        user.updated_by_user = "New updating user"
        user.created_on = "2017-01-03T00:00:00.000Z"
        user.created_by_user = "New creating user"

        val updatedRecord = UserMapper.updateUserRecordWithUser(user, usersRecord)
        assertThat(updatedRecord.name).isEqualTo("new name")
        assertThat(updatedRecord.passwordHash).isEqualTo("new hash")
        assertThat(updatedRecord.totalLoginFailures).isEqualTo(2)
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
        val currentNumberOfPropertiesOnUser = 10
        assertThat(User::class.memberProperties.size).isEqualTo(currentNumberOfPropertiesOnUser)
    }
}