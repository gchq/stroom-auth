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

import org.junit.Test;
import stroom.auth.resources.user.v1.User;
import stroom.auth.daos.UserMapper;
import stroom.db.auth.tables.records.UsersRecord;

import java.sql.Timestamp;

import static org.assertj.core.api.Assertions.assertThat;

public final class UserMapperTest {
  @Test
  public final void testMappings() {
    UsersRecord usersRecord = new UsersRecord();
    usersRecord.setId(Integer.valueOf(1));
    usersRecord.setEmail("email");
    usersRecord.setPasswordHash("hash");
    usersRecord.setState("enabled");
    usersRecord.setFirstName("first name");
    usersRecord.setLastName("last name");
    usersRecord.setComments("comments");
    usersRecord.setLoginFailures(Integer.valueOf(2));
    usersRecord.setLoginCount(Integer.valueOf(4));
    usersRecord.setLastLogin(new Timestamp(System.currentTimeMillis()));
    usersRecord.setUpdatedOn(new Timestamp(System.currentTimeMillis()));
    usersRecord.setUpdatedByUser("updating user");
    usersRecord.setCreatedOn(new Timestamp(System.currentTimeMillis()));
    usersRecord.setCreatedByUser("creating user");

    User user = new User();
    user.setId(Integer.valueOf(2));
    user.setEmail("new email");
    user.setPassword_hash("new hash");
    user.setState("disabled");
    user.setFirst_name("new first name");
    user.setLast_name("new last name");
    user.setComments("new comments");
    user.setLogin_failures(Integer.valueOf(3));
    user.setLogin_count(Integer.valueOf(5));
    user.setLast_login("2017-01-01T00:00:00.000Z");
    user.setUpdated_on("2017-01-02T00:00:00.000Z");
    user.setUpdated_by_user("New updating user");
    user.setCreated_on("2017-01-03T00:00:00.000Z");
    user.setCreated_by_user("New creating user");

    UsersRecord updatedRecord = UserMapper.updateUserRecordWithUser(user, usersRecord);
    assertThat(updatedRecord.getId()).isEqualTo(2);
    assertThat(updatedRecord.getEmail()).isEqualTo("new email");
    assertThat(updatedRecord.getPasswordHash()).isEqualTo("new hash");
    assertThat(updatedRecord.getState()).isEqualTo("disabled");
    assertThat(updatedRecord.getFirstName()).isEqualTo("new first name");
    assertThat(updatedRecord.getLastName()).isEqualTo("new last name");
    assertThat(updatedRecord.getComments()).isEqualTo("new comments");
    assertThat(updatedRecord.getLoginFailures()).isEqualTo(3);
    assertThat(updatedRecord.getLoginCount()).isEqualTo(5);
    assertThat(updatedRecord.getLastLogin()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-01T00:00:00.000Z"));
    assertThat(updatedRecord.getUpdatedOn()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-02T00:00:00.000Z"));
    assertThat(updatedRecord.getUpdatedByUser()).isEqualTo("New updating user");
    assertThat(updatedRecord.getCreatedOn()).isEqualTo(UserMapper.convertISO8601ToTimestamp("2017-01-03T00:00:00.000Z"));
    assertThat(updatedRecord.getCreatedByUser()).isEqualTo("New creating user");
  }

  @Test
  public final void updateReminder() {
    // This test will fail if you add a property to the Users class.
    // To make it pass you'll need to updated the count, below.
    // It exists to remind you to add a mapping in UserMapper.
    // The count is one more than the number in UserRecord, because it has a 'password' property.
    int currentNumberOfPropertiesOnUser = 15;
    assertThat(User.class.getDeclaredFields().length).isEqualTo(currentNumberOfPropertiesOnUser);
  }
}
