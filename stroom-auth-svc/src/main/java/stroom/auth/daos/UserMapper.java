/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.daos;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import stroom.auth.resources.user.v1.User;
import stroom.auth.db.tables.records.UsersRecord;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

public final class UserMapper {

    public static UsersRecord updateUserRecordWithUser(@NotNull User user, @NotNull UsersRecord usersRecord) {
        return updateUserRecordWithUser(user, usersRecord, Clock.systemDefaultZone());
    }

    @NotNull
    public static UsersRecord updateUserRecordWithUser(@NotNull User user, @NotNull UsersRecord usersRecord, Clock clock) {
        Preconditions.checkNotNull(user);
        Preconditions.checkNotNull(usersRecord);

        HashMap userMap = new HashMap();

        if (user.getId() != null) userMap.put("id", user.getId());
        if (!Strings.isNullOrEmpty(user.getEmail())) userMap.put("email", user.getEmail());
        if (!Strings.isNullOrEmpty(user.getPassword_hash())) userMap.put("password_hash", user.getPassword_hash());
        // This will override the setting for getPasswordHash, above. If there's a hash it'll map that,
        // but if there's a password it'll update the hash.
        if (!Strings.isNullOrEmpty(user.getPassword())) userMap.put("password_hash", user.generatePasswordHash());
        if (user.getFirst_name() != null) userMap.put("first_name", user.getFirst_name());
        if (user.getLast_name() != null)userMap.put("last_name", user.getLast_name());
        if (user.getComments() != null) userMap.put("comments", user.getComments());
        if (user.getLogin_count() != null) userMap.put("login_count", user.getLogin_count());
        if (user.getLogin_failures() != null) userMap.put("login_failures", user.getLogin_failures());
        if (user.getLast_login() != null) userMap.put("last_login", convertISO8601ToTimestamp(user.getLast_login()));
        if (user.getCreated_on() != null) userMap.put("created_on", convertISO8601ToTimestamp(user.getCreated_on()));
        if (user.getCreated_by_user() != null) userMap.put("created_by_user", user.getCreated_by_user());
        if (user.getUpdated_on() != null) userMap.put("updated_on", convertISO8601ToTimestamp(user.getUpdated_on()));
        if (user.getUpdated_by_user() != null) userMap.put("updated_by_user", user.getUpdated_by_user());

        userMap.put("never_expires", user.getNever_expires());

        // This is last because if we're going from locked to enabled then we need to reset the login failures.
        // And in this case we'll want to override any other setting for login_failures.
        if (user.getState() != null) {
            // Is this user's state becoming enabled?
            if(!usersRecord.getState().equals(User.UserState.ENABLED.getStateText())
                && user.getState().equalsIgnoreCase(User.UserState.ENABLED.getStateText())) {
                userMap.put("login_failures", 0);
                userMap.put("last_login", clock.instant());
                userMap.put("reactivated_date", clock.instant());
            }
            userMap.put("state", user.getState());
        }

        usersRecord.from(userMap);
        return usersRecord;
    }

    public static UsersRecord map(User user){
        UsersRecord usersRecord = new UsersRecord();
        usersRecord.setComments(user.getComments());
        usersRecord.setCreatedByUser(user.getCreated_by_user());
        usersRecord.setCreatedOn(convertISO8601ToTimestamp(user.getCreated_on()));
        usersRecord.setEmail(user.getEmail());
        usersRecord.setFirstName(user.getFirst_name());
        usersRecord.setId(user.getId());
        usersRecord.setLastLogin(convertISO8601ToTimestamp(user.getLast_login()));
        usersRecord.setLastName(user.getLast_name());
        usersRecord.setLoginCount(user.getLogin_count());
        usersRecord.setLoginFailures(user.getLogin_failures());
        usersRecord.setNeverExpires(user.getNever_expires());
        usersRecord.setPasswordHash(user.generatePasswordHash());
        usersRecord.setReactivatedDate(convertISO8601ToTimestamp(user.getReactivatedDate()));
        usersRecord.setState(user.getState());
        usersRecord.setState(user.getState());
        usersRecord.setUpdatedByUser(user.getUpdated_by_user());
        usersRecord.setUpdatedOn(convertISO8601ToTimestamp(user.getUpdated_on()));
        return usersRecord;
    }

    public static User map(UsersRecord usersRecord) {
        User user = new User();
        user.setEmail(usersRecord.getEmail());
        user.setState(usersRecord.getState());
        user.setComments(usersRecord.getComments());
        user.setId(usersRecord.getId());
        user.setFirst_name(usersRecord.getFirstName());
        user.setLast_name(usersRecord.getLastName());
        user.setNever_expires(usersRecord.getNeverExpires());
        user.setUpdated_by_user(usersRecord.getUpdatedByUser());
        if(usersRecord.getUpdatedOn() != null) {
            user.setUpdated_on(toIso(usersRecord.getUpdatedOn()));
        }
        user.setCreated_by_user(usersRecord.getCreatedByUser());
        if(usersRecord.getCreatedOn() != null) {
            user.setCreated_on(toIso(usersRecord.getCreatedOn()));
        }
        if(usersRecord.getLastLogin() != null) {
            user.setLast_login(toIso(usersRecord.getLastLogin()));
        }
        if(usersRecord.getReactivatedDate() != null) {
            user.setReactivatedDate(toIso(usersRecord.getReactivatedDate()));
        }
        user.setLogin_count(usersRecord.getLoginCount());
        user.setLogin_failures(usersRecord.getLoginFailures());
        return user;
    }


    public static String toIso(Timestamp timestamp){
        return timestamp.toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public static Timestamp convertISO8601ToTimestamp(@Nullable String dateString) {
        if(dateString != null) {
            long millis = LocalDateTime.parse(dateString).toInstant(ZoneOffset.UTC).toEpochMilli();
            return new Timestamp(millis);
        }
        else return null;
    }

}
