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

import stroom.db.auth.tables.records.UsersRecord
import java.sql.Timestamp
import java.time.ZonedDateTime

class UserMapper {

    companion object {
        fun updateUserRecordWithUser(user: User, usersRecord: UsersRecord): UsersRecord {
            var userMap = HashMap<String, Any>()
            if(user.id != null) userMap.put("id", user.id!!)
            if(user.password_hash != null) userMap.put("password_hash", user.password_hash!!)
            if(user.name != null) userMap.put("name", user.name!!)
            if(user.last_login!= null) userMap.put("last_login", convertISO8601ToTimestamp(user.last_login))
            if(user.total_login_failures != null) userMap.put("total_login_failures", user.total_login_failures!!)
            if(user.created_on != null) userMap.put("created_on", convertISO8601ToTimestamp(user.created_on))
            if(user.created_by_user != null) userMap.put("created_by_user", user.created_by_user!!)
            if(user.updated_on != null) userMap.put("updated_on", convertISO8601ToTimestamp(user.updated_on))
            if(user.updated_by_user != null) userMap.put("updated_by_user", user.updated_by_user!!)

            usersRecord.from(userMap)
            return usersRecord
        }

        fun convertISO8601ToTimestamp(dateString: String?): Timestamp {
            val millis = ZonedDateTime.parse(dateString).toInstant().toEpochMilli()
            return Timestamp(millis)
        }
    }
}