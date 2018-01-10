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
import stroom.auth.exceptions.UnauthorisedException;
import stroom.auth.resources.user.v1.User;
import stroom.db.auth.Tables;
import stroom.db.auth.tables.records.UsersRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZonedDateTime;

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

    public boolean areCredentialsValid(String email, String password) {
        if (Strings.isNullOrEmpty(email)
                || Strings.isNullOrEmpty(password)) {
            throw new BadRequestException("Please provide both email and password");
        }

        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        if (user == null) {
            LOGGER.debug("Request to log in with invalid email: " + email);
            // We're returning a different message because we don't want to reveal that the email doesn't exist.
            throw new UnauthorisedException("Invalid credentials");
        }

        // Don't let them in if the account is locked or disabled.
        if (user.getState().equals(User.UserState.DISABLED.getStateText())
                || user.getState().equals(User.UserState.LOCKED.getStateText())) {
            LOGGER.debug("Account {} tried to log in but it is disabled or locked.", email);
            throw new UnauthorisedException("This account is locked or disabled");
        }

        boolean isPasswordCorrect = BCrypt.checkpw(password, user.getPasswordHash());

        return isPasswordCorrect;
    }

    public void incrementLoginFailures(String email) {
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
            throw new UnauthorisedException("Too many failed attempts - this account is now locked");
        }
    }

    public User get(String email) {
        User user = database
                .selectFrom(USERS)
                .where(USERS.EMAIL.eq(email)).fetchOne().into(User.class);
        return user;
    }

    public void changePassword(String email, String newPassword) {
        UsersRecord user = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne();

        if(user == null){
            throw new NoSuchUserException("Cannot change this password because I cannot find this user!");
        }

        String newPasswordHash = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        user.setPasswordHash(newPasswordHash);

        database.update((Table) USERS)
                .set(user)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .execute();
    }

    public int disableNewInactiveUsers(int inactivityThresholdInDays){
        Timestamp activityThreshold = convertThresholdToTimestamp(inactivityThresholdInDays);

        int numberOfDisabledAccounts = database
                .update(Tables.USERS)
                .set(Tables.USERS.STATE, "disabled")
                .where(Tables.USERS.CREATED_ON.lessOrEqual(activityThreshold))
                .and(Tables.USERS.LAST_LOGIN.isNull())
                // We don't want to disable admin because that could lock the users out of the system
                .and(Tables.USERS.EMAIL.ne("admin"))
                .execute();

        return numberOfDisabledAccounts;
    }

    public int disableInactiveUsers(int inactivityThresholdInDays){
        Timestamp activityThreshold = convertThresholdToTimestamp(inactivityThresholdInDays);

        int numberOfDisabledAccounts = database
                .update(Tables.USERS)
                .set(Tables.USERS.STATE, "disabled")
                .where(Tables.USERS.LAST_LOGIN.lessOrEqual(activityThreshold))
                // We don't want to disable admin because that could lock the users out of the system
                .and(Tables.USERS.EMAIL.ne("admin"))
                .execute();

        return numberOfDisabledAccounts;
    }

    private Timestamp convertThresholdToTimestamp(int days){
        Instant now = Instant.now(clock);
        Instant thresholdInstant = now.minus(Period.ofDays(days));
        return Timestamp.from(thresholdInstant);
    }

}
