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

import com.google.common.base.Strings;
import org.apache.commons.lang3.Validate;
import org.jooq.Condition;
import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.config.Config;
import stroom.auth.exceptions.BadRequestException;
import stroom.auth.exceptions.NoSuchUserException;
import stroom.auth.resources.user.v1.User;
import stroom.db.auth.Tables;
import stroom.db.auth.tables.records.UsersRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static stroom.db.auth.Tables.USERS;

@Singleton
public class UserDao {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserDao.class);

    @Inject
    private Configuration jooqConfig;

    private DSLContext database = null;
    private Config config;
    private Clock clock;

    @Inject
    public UserDao(Config config) {
        this.config = config;
        this.clock = Clock.systemDefaultZone();
    }

    @Inject
    private void init() {
        if(this.jooqConfig != null){
            database = DSL.using(this.jooqConfig);
        }
    }

    public void setDatabase(DSLContext database){
        this.database = database;
    }

    public void setClock(Clock clock){
        this.clock = clock;
    }

    public int create(User newUser, String creatingUsername){
        UsersRecord usersRecord = (UsersRecord) database
                .insertInto((Table) USERS)
                .set(USERS.EMAIL, newUser.getEmail())
                .set(USERS.PASSWORD_HASH, newUser.generatePasswordHash())
                .set(USERS.FIRST_NAME, newUser.getFirst_name())
                .set(USERS.LAST_NAME, newUser.getLast_name())
                .set(USERS.COMMENTS, newUser.getComments())
                .set(USERS.STATE, newUser.getState())
                .set(USERS.CREATED_ON, Timestamp.from(Instant.now(clock)))
                .set(USERS.CREATED_BY_USER, creatingUsername)
                .set(USERS.NEVER_EXPIRES, newUser.getNever_expires())
                .returning(new Field[]{USERS.ID}).fetchOne();
        return usersRecord.getId();
    }



    public void recordSuccessfulLogin(String email) {
        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        // We reset the failed login count if we have a successful login
        user.setLoginFailures(0);
        user.setLoginCount(user.getLoginCount() + 1);
        user.setLastLogin(UserMapper.convertISO8601ToTimestamp(ZonedDateTime.now(clock).toString()));
        database
                .update((Table) USERS)
                .set(user)
                .where(new Condition[]{USERS.EMAIL.eq(user.getEmail())}).execute();
    }

    public LoginResult areCredentialsValid(String email, String password) {
        if (Strings.isNullOrEmpty(email)
                || Strings.isNullOrEmpty(password)) {
            throw new BadRequestException("Please provide both email and password");
        }

        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        if (user == null) {
            LOGGER.debug("Request to log in with invalid username: " + email);
            return LoginResult.USER_DOES_NOT_EXIST;
        }
        else {
            boolean isPasswordCorrect = BCrypt.checkpw(password, user.getPasswordHash());
            boolean isDisabled = user.getState().equals(User.UserState.DISABLED.getStateText());
            boolean isLocked = user.getState().equals(User.UserState.LOCKED.getStateText());

            if (isLocked) {
                LOGGER.debug("Account {} tried to log in but it is disabled.", email);
                return isPasswordCorrect ? LoginResult.LOCKED_GOOD_CREDENTIALS : LoginResult.LOCKED_BAD_CREDENTIALS;
            }
            else if (isDisabled) {
                LOGGER.debug("Account {} tried to log in but it is locked.", email);
                return isPasswordCorrect ? LoginResult.DISABLED_GOOD_CREDENTIALS : LoginResult.DISABLED_BAD_CREDENTIALS;
            }
            else {
                return isPasswordCorrect ? LoginResult.GOOD_CREDENTIALS : LoginResult.BAD_CREDENTIALS;
            }
        }
    }

    public boolean incrementLoginFailures(String email) {
        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        // If the password is wrong we need to increment the failed login count,
        // check if we need to locked the account, and save.
        user.setLoginFailures(user.getLoginFailures() + 1);
        boolean shouldLock = user.getLoginFailures() >= this.config.getFailedLoginLockThreshold();

        if (shouldLock) {
            user.setState(User.UserState.LOCKED.getStateText());
        }

        database
                .update((Table) USERS)
                .set(user)
                .where(new Condition[]{USERS.EMAIL.eq(email)}).execute();

        if (shouldLock) {
            LOGGER.debug("Account {} has had too many failed access attempts and is locked", email);
        }

        return shouldLock;
    }

    public Optional<User> get(String email) {
        Optional<UsersRecord> userQuery = database
                .selectFrom(USERS)
                .where(USERS.EMAIL.eq(email)).fetchOptional();

        // Convert the UsersRecord into a User.
        return userQuery.map(usersRecord ->
                usersRecord.into(User.class));
    }

    public void changePassword(String email, String newPassword) {
        UsersRecord user = database
                .selectFrom(USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        if(user == null){
            throw new NoSuchUserException("Cannot change this password because this user does not exist!");
        }

        String newPasswordHash = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        user.setPasswordHash(newPasswordHash);
        user.setPasswordLastChanged(Timestamp.from(clock.instant()));

        database.update((Table) USERS)
                .set(user)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .execute();
    }

    public Boolean needsPasswordChange(String email, int passwordChangeThresholdInMins, boolean forcePasswordChangeOnFirstLogin) {
        Validate.notNull(email, "email must not be null");
        Validate.inclusiveBetween(0, Integer.MAX_VALUE, passwordChangeThresholdInMins);

        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        if(user == null){
            throw new NoSuchUserException("Cannot check if this user needs a password change because this user does not exist!");
        }

        LocalDateTime passwordLastChanged = user.getPasswordLastChanged() == null ?
                user.getCreatedOn().toLocalDateTime() :
                user.getPasswordLastChanged().toLocalDateTime();
        LocalDateTime now = LocalDateTime.ofInstant(Instant.now(clock), ZoneId.systemDefault());
        long minsSinceLastPasswordChange = passwordLastChanged.until(now, ChronoUnit.MINUTES);

        boolean thresholdBreached = minsSinceLastPasswordChange >= passwordChangeThresholdInMins;
        boolean isFirstLogin = user.getPasswordLastChanged() == null;

        if(thresholdBreached || (forcePasswordChangeOnFirstLogin && isFirstLogin)){
            LOGGER.debug("User {} needs a password change.", email);
            return true;
        } else return false;
    }

    public int disableNewInactiveUsers(int inactivityThresholdInMins){
        Timestamp activityThreshold = convertThresholdToTimestamp(inactivityThresholdInMins);

        int numberOfDisabledAccounts = database
                .update(Tables.USERS)
                .set(Tables.USERS.STATE, "disabled")
                .where(Tables.USERS.CREATED_ON.lessOrEqual(activityThreshold))
                // We are only going to deactivate enabled accounts
                .and(USERS.STATE.eq("enabled"))
                // A 'new' user is one who has never logged in.
                .and(Tables.USERS.LAST_LOGIN.isNull())
                // We don't want to disable admin because that could lock the users out of the system
                .and(USERS.NEVER_EXPIRES.ne(true))
                .execute();

        return numberOfDisabledAccounts;
    }

    public int disableInactiveUsers(int inactivityThresholdInMins){
        Timestamp activityThreshold = convertThresholdToTimestamp(inactivityThresholdInMins);

        int numberOfDisabledAccounts = database
                .update(Tables.USERS)
                .set(Tables.USERS.STATE, "disabled")
                .where(Tables.USERS.LAST_LOGIN.lessOrEqual(activityThreshold))
                // We are only going to deactivate enabled accounts
                .and(USERS.STATE.eq("enabled"))
                // We don't want to disable admin because that could lock the users out of the system
                .and(USERS.NEVER_EXPIRES.ne(true))
                .execute();

        return numberOfDisabledAccounts;
    }

    public boolean exists(String id) {
        UsersRecord result = database.selectFrom(Tables.USERS).where(Tables.USERS.EMAIL.eq(id)).fetchOne();
        return result != null;
    }

    private Timestamp convertThresholdToTimestamp(int mins){
        Instant now = Instant.now(clock);
        Instant thresholdInstant = now.minus(Duration.ofMinutes(mins));
        return Timestamp.from(thresholdInstant);
    }

    public enum LoginResult {
        GOOD_CREDENTIALS,
        BAD_CREDENTIALS,
        LOCKED_BAD_CREDENTIALS,
        LOCKED_GOOD_CREDENTIALS,
        DISABLED_BAD_CREDENTIALS,
        DISABLED_GOOD_CREDENTIALS,
        USER_DOES_NOT_EXIST
    }

}
