/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.Test;
import stroom.auth.daos.UserMapper;
import stroom.auth.db.tables.records.UsersRecord;
import stroom.auth.resources.user.v1.User;

import java.sql.Timestamp;
import java.time.*;

import static org.assertj.core.api.Assertions.assertThat;
import static stroom.auth.resources.user.v1.User.UserState.DISABLED;
import static stroom.auth.resources.user.v1.User.UserState.ENABLED;
import static stroom.auth.resources.user.v1.User.UserState.INACTIVE;

public final class UserMapperTest {
    @Test
    public final void testMappings() {
        UsersRecord usersRecord = new UsersRecord();
        usersRecord.setId(1);
        usersRecord.setEmail("email");
        usersRecord.setPasswordHash("hash");
        usersRecord.setState(ENABLED.getStateText());
        usersRecord.setFirstName("first name");
        usersRecord.setLastName("last name");
        usersRecord.setComments("comments");
        usersRecord.setLoginFailures(2);
        usersRecord.setLoginCount(4);
        usersRecord.setLastLogin(new Timestamp(System.currentTimeMillis()));
        usersRecord.setUpdatedOn(new Timestamp(System.currentTimeMillis()));
        usersRecord.setUpdatedByUser("updating user");
        usersRecord.setCreatedOn(new Timestamp(System.currentTimeMillis()));
        usersRecord.setCreatedByUser("creating user");
        usersRecord.setNeverExpires(true);
        usersRecord.setReactivatedDate(new Timestamp(System.currentTimeMillis()));
        usersRecord.setForcePasswordChange(true);

        User user = getUsers().getRight();

        UsersRecord updatedRecord = UserMapper.updateUserRecordWithUser(user, usersRecord);
        assertThat(updatedRecord.getId()).isEqualTo(2);
        assertThat(updatedRecord.getEmail()).isEqualTo("new email");
        assertThat(updatedRecord.getPasswordHash()).isEqualTo("new hash");
        assertThat(updatedRecord.getState()).isEqualTo(DISABLED.getStateText());
        assertThat(updatedRecord.getFirstName()).isEqualTo("new first name");
        assertThat(updatedRecord.getLastName()).isEqualTo("new last name");
        assertThat(updatedRecord.getComments()).isEqualTo("new comments");
        assertThat(updatedRecord.getLoginFailures()).isEqualTo(3);
        assertThat(updatedRecord.getLoginCount()).isEqualTo(5);
        assertThat(updatedRecord.getLastLogin()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-01T00:00:00"));
        assertThat(updatedRecord.getUpdatedOn()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-02T00:00:00"));
        assertThat(updatedRecord.getUpdatedByUser()).isEqualTo("New updating user");
        assertThat(updatedRecord.getCreatedOn()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-03T00:00:00"));
        assertThat(updatedRecord.getCreatedByUser()).isEqualTo("New creating user");
        assertThat(updatedRecord.getNeverExpires()).isEqualTo(false);
        assertThat(updatedRecord.getForcePasswordChange()).isEqualTo(true);
        // NB: We don't need to map reactivate_date because it's set by this method anyway.
//        assertThat(updatedRecord.getReactivatedDate()).isEqualTo("2018-01-01T10:10:10");
    }

    @Test
    public final void userToRecord() {
        Pair<UsersRecord, User> users = getUsers();
        UsersRecord mapped = UserMapper.map(users.getRight());
        UsersRecord orig = users.getLeft();
        assertThat(mapped.getId()).isEqualTo(orig.getId());
        assertThat(mapped.getReactivatedDate()).isEqualTo(orig.getReactivatedDate());
        assertThat(mapped.getState()).isEqualTo(orig.getState());
        assertThat(mapped.getCreatedOn()).isEqualTo(orig.getCreatedOn());
        assertThat(mapped.getUpdatedOn()).isEqualTo(orig.getUpdatedOn());
        assertThat(mapped.getLoginFailures()).isEqualTo(orig.getLoginFailures());
        assertThat(mapped.getEmail()).isEqualTo(orig.getEmail());
        assertThat(mapped.getLastLogin()).isEqualTo(orig.getLastLogin());
        assertThat(mapped.getLoginCount()).isEqualTo(orig.getLoginCount());
        assertThat(mapped.getPasswordLastChanged()).isEqualTo(orig.getPasswordLastChanged());
        assertThat(mapped.getComments()).isEqualTo(orig.getComments());
        assertThat(mapped.getCreatedByUser()).isEqualTo(orig.getCreatedByUser());
        assertThat(mapped.getFirstName()).isEqualTo(orig.getFirstName());
        assertThat(mapped.getLastName()).isEqualTo(orig.getLastName());
        assertThat(mapped.getNeverExpires()).isEqualTo(orig.getNeverExpires());
        // NB: We don't assert that the password has is equal because this is generated. We just assert it's not null.
        assertThat(mapped.getPasswordHash()).isNotNull();
        assertThat(mapped.getUpdatedByUser()).isEqualTo(orig.getUpdatedByUser());
        assertThat(mapped.getForcePasswordChange()).isEqualTo(orig.getForcePasswordChange());
    }

    @Test
    public final void recordToUser() {
        Pair<UsersRecord, User> users = getUsers();
        User mapped = UserMapper.map(users.getLeft());
        User orig = users.getRight();
        assertThat(mapped.getId()).isEqualTo(orig.getId());
        assertThat(mapped.getReactivatedDate()).isEqualTo(orig.getReactivatedDate());
        assertThat(mapped.getState()).isEqualTo(orig.getState());
        assertThat(mapped.getCreatedOn()).isEqualTo(orig.getCreatedOn());
        assertThat(mapped.getUpdatedOn()).isEqualTo(orig.getUpdatedOn());
        assertThat(mapped.getLoginFailures()).isEqualTo(orig.getLoginFailures());
        assertThat(mapped.getEmail()).isEqualTo(orig.getEmail());
        assertThat(mapped.getLastLogin()).isEqualTo(orig.getLastLogin());
        assertThat(mapped.getLoginCount()).isEqualTo(orig.getLoginCount());
        //TODO Add get password last change to the POJO
//        assertThat(mapped.getPasswordLastChanged()).isEqualTo(orig.get());
        assertThat(mapped.getComments()).isEqualTo(orig.getComments());
        assertThat(mapped.getCreatedByUser()).isEqualTo(orig.getCreatedByUser());
        assertThat(mapped.getFirstName()).isEqualTo(orig.getFirstName());
        assertThat(mapped.getLastName()).isEqualTo(orig.getLastName());
        assertThat(mapped.getNeverExpires()).isEqualTo(orig.getNeverExpires());
        // NB: We don't need to check password hash mapping
//        assertThat(mapped.getPasswordHash()).isNotNull();
        assertThat(mapped.getUpdatedByUser()).isEqualTo(orig.getUpdatedByUser());
        assertThat(mapped.isForcePasswordChange()).isEqualTo(orig.isForcePasswordChange());
    }

    @Test
    public final void testBecomingEnabledFromDisabled() {
        Pair<UsersRecord, User> users = getUsers();

        users.getLeft().setState(DISABLED.getStateText());
        users.getRight().setState(ENABLED.getStateText());

        Instant now = Instant.now();
        UsersRecord mapped = UserMapper.updateUserRecordWithUser(users.getRight(), users.getLeft(), Clock.fixed(now, ZoneId.systemDefault()) );
        assertThat(mapped.getState()).isEqualTo(ENABLED.getStateText());
        assertThat(mapped.getLastLogin().toInstant().getEpochSecond()).isEqualTo(now.getEpochSecond());
        assertThat(mapped.getLoginFailures()).isEqualTo(0);
    }

    @Test
    public final void testBecomingEnabledFromInactive() {
        Pair<UsersRecord, User> users = getUsers();

        users.getLeft().setState(INACTIVE.getStateText());
        users.getRight().setState(ENABLED.getStateText());

        Instant now = Instant.now();
        UsersRecord mapped = UserMapper.updateUserRecordWithUser(users.getRight(), users.getLeft(), Clock.fixed(now, ZoneId.systemDefault()) );
        assertThat(mapped.getState()).isEqualTo(ENABLED.getStateText());
        assertThat(mapped.getLastLogin().toInstant().getEpochSecond()).isEqualTo(now.getEpochSecond());
        assertThat(mapped.getLoginFailures()).isEqualTo(0);
    }

    @Test
    public final void updateReminder() {
        // This test will fail if you add a property to the Users class.
        // To make it pass you'll need to updated the count, below.
        // It exists to remind you to add a mapping in UserMapper.
        // The count is one more than the number in UserRecord, because it has a 'password' property.
        int currentNumberOfPropertiesOnUser = 18;
        assertThat(User.class.getDeclaredFields().length).isEqualTo(currentNumberOfPropertiesOnUser);
    }

    public static final Pair<UsersRecord, User> getUsers() {
        User user = new User();
        UsersRecord usersRecord = new UsersRecord();

        user.setId(2);
        usersRecord.setId(2);

        user.setEmail("new email");
        usersRecord.setEmail("new email");

        user.setPasswordHash("new hash");
        usersRecord.setPasswordHash(user.generatePasswordHash());

        user.setState(DISABLED.getStateText());
        usersRecord.setState(DISABLED.getStateText());

        user.setFirstName("new first name");
        usersRecord.setFirstName("new first name");

        user.setLastName("new last name");
        usersRecord.setLastName("new last name");

        user.setComments("new comments");
        usersRecord.setComments("new comments");

        user.setLoginFailures(3);
        usersRecord.setLoginFailures(3);

        user.setLoginCount(5);
        usersRecord.setLoginCount(5);

        user.setLastLogin("2017-01-01T00:00:00");
        usersRecord.setLastLogin(isoToTimestamp("2017-01-01T00:00:00.000"));

        user.setUpdatedOn("2017-01-02T00:00:00");
        usersRecord.setUpdatedOn(isoToTimestamp("2017-01-02T00:00:00"));

        user.setUpdatedByUser("New updating user");
        usersRecord.setUpdatedByUser("New updating user");

        user.setCreatedOn("2017-01-03T00:00:00");
        usersRecord.setCreatedOn(isoToTimestamp("2017-01-03T00:00:00"));

        user.setCreatedByUser("New creating user");
        usersRecord.setCreatedByUser("New creating user");

        user.setNeverExpires(false);
        usersRecord.setNeverExpires(false);

        user.setReactivatedDate("2019-01-01T10:10:10");
        usersRecord.setReactivatedDate(isoToTimestamp("2019-01-01T10:10:10"));

        user.setForcePasswordChange(true);
        usersRecord.setForcePasswordChange(true);

        return new ImmutablePair(usersRecord, user);
    }

    private static Timestamp isoToTimestamp(String iso8601) {
        return Timestamp.from(LocalDateTime.parse(iso8601).toInstant(ZoneOffset.UTC));
    }
}
