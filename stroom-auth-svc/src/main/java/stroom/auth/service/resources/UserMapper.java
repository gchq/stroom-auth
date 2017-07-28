package stroom.auth.service.resources;

import com.google.common.base.Preconditions;
import stroom.db.auth.tables.records.UsersRecord;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.HashMap;

public final class UserMapper {

    @NotNull
  public static final UsersRecord updateUserRecordWithUser(@NotNull User user, @NotNull UsersRecord usersRecord) {
    Preconditions.checkNotNull(user);
    Preconditions.checkNotNull(usersRecord);

    HashMap userMap = new HashMap();

    if(user.getId() != null) userMap.put("id", user.getId());
    if(user.getEmail() != null) userMap.put("email", user.getEmail());
    if(user.getPassword_hash() != null) userMap.put("password_hash", user.getPassword_hash());
    if(user.getState() != null) userMap.put("state", user.getState());
    if(user.getFirst_name() != null) userMap.put("first_name", user.getFirst_name());
    if(user.getLast_name() != null) userMap.put("last_name", user.getLast_name());
    if(user.getComments() != null) userMap.put("comments", user.getComments());
    if(user.getLogin_count() != null) userMap.put("login_count", user.getLogin_count());
    if(user.getLogin_failures() != null) userMap.put("login_failures", user.getLogin_failures());
    if(user.getLast_login()!= null) userMap.put("last_login", convertISO8601ToTimestamp(user.getLast_login()));
    if(user.getCreated_on() != null) userMap.put("created_on", convertISO8601ToTimestamp(user.getCreated_on()));
    if(user.getCreated_by_user() != null) userMap.put("created_by_user", user.getCreated_by_user());
    if(user.getUpdated_on() != null) userMap.put("updated_on", convertISO8601ToTimestamp(user.getUpdated_on()));
    if(user.getUpdated_by_user() != null) userMap.put("updated_by_user", user.getUpdated_by_user());

    usersRecord.from(userMap);
    return usersRecord;
  }

  @NotNull
  public static final Timestamp convertISO8601ToTimestamp(@Nullable String dateString) {
    long millis = ZonedDateTime.parse((CharSequence)dateString).toInstant().toEpochMilli();
    return new Timestamp(millis);
  }

}
