package stroom.auth.daos;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.junit.Test;
import stroom.auth.resources.user.v1.User;
import stroom.auth.service.resources.support.Database_IT;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZoneId;
import java.util.UUID;

import static junit.framework.TestCase.fail;
import static org.assertj.core.api.Assertions.assertThat;

public class UserDao_IT extends Database_IT {

    private static final String DISABLED = "disabled";
    private static final String ENABLED = "enabled";

    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(UserDao_IT.class);

    @Test
    public void testNewButInactiveUserIsDisabled(){
        try (Connection conn = DriverManager.getConnection(mysql.getJdbcUrl(), JDBC_USER, JDBC_PASSWORD)) {
            // GIVEN...
            UserDao userDao = getUserDao(conn);

            final String user01 = UUID.randomUUID().toString();
            final String user02 = UUID.randomUUID().toString();
            final String user03 = UUID.randomUUID().toString();

            // Create a test user who should be disabled
            createUserAccount(userDao, user01);

            // Create a user who would be disabled if they hadn't logged in already
            createUserAccount(userDao, user02);
            userDao.recordSuccessfulLogin(user02);

            // Advance the clock and create a test user who shouldn't be disabled
            setClockToDaysFromNow(userDao, 10);
            createUserAccount(userDao, user03);

            // WHEN...
            setClockToDaysFromNow(userDao, 31);
            int numberOfDisabledUsers = userDao.disableNewInactiveUsers(30);

            // THEN...
            assertThat(numberOfDisabledUsers).isEqualTo(1);
            assertThat(userDao.get(user01).get().getState()).isEqualTo(DISABLED);
            assertThat(userDao.get(user02).get().getState()).isEqualTo(ENABLED);
            assertThat(userDao.get(user03).get().getState()).isEqualTo(ENABLED);

        } catch (SQLException e) {
            e.printStackTrace();
            fail();
        }
    }

    @Test
    public void testInactiveUserIsDisabled(){
        try (Connection conn = DriverManager.getConnection(mysql.getJdbcUrl(), JDBC_USER, JDBC_PASSWORD)) {
            // GIVEN...
            UserDao userDao = getUserDao(conn);

            final String user01 = UUID.randomUUID().toString();
            final String user02 = UUID.randomUUID().toString();

            // Create a test user who should be disabled
            createUserAccount(userDao, user01);
            userDao.recordSuccessfulLogin(user01);

            // Advance the clock and create a test user who shouldn't be disabled
            setClockToDaysFromNow(userDao, 10);
            createUserAccount(userDao, user02);
            userDao.recordSuccessfulLogin(user02);

            // WHEN...
            setClockToDaysFromNow(userDao, 91);
            int numberOfDisabledUsers = userDao.disableInactiveUsers(90);

            // THEN...
            assertThat(numberOfDisabledUsers).isEqualTo(1);
            assertThat(userDao.get(user01).get().getState()).isEqualTo(DISABLED);
            assertThat(userDao.get(user02).get().getState()).isEqualTo(ENABLED);

            // ALSO WHEN...
            setClockToDaysFromNow(userDao, 200);
            numberOfDisabledUsers = userDao.disableInactiveUsers(90);

            //ALSO THEN...
            assertThat(numberOfDisabledUsers).isEqualTo(2);
            assertThat(userDao.get(user01).get().getState()).isEqualTo(DISABLED);
            assertThat(userDao.get(user02).get().getState()).isEqualTo(DISABLED);

        } catch (SQLException e) {
            e.printStackTrace();
            fail();
        }
    }

    @Test
    public void testNeedsPasswordChange() {
        try (Connection conn = DriverManager.getConnection(mysql.getJdbcUrl(), JDBC_USER, JDBC_PASSWORD)) {
            // GIVEN...
            UserDao userDao = getUserDao(conn);

            final String user01 = UUID.randomUUID().toString();

            // Create a test user who should be disabled
            createUserAccount(userDao, user01);
            userDao.recordSuccessfulLogin(user01);

            // WHEN...
            setClockToDaysFromNow(userDao, 90);

            // THEN...
            // Simple
            Boolean shouldNotNeedChange = userDao.needsPasswordChange(user01, 1, true);
            assertThat(shouldNotNeedChange).isTrue();

            Boolean shouldNeedChange = userDao.needsPasswordChange(user01, 200, true);
            // True because they've not had a password change.
            assertThat(shouldNeedChange).isTrue();

            // Boundary cases
            Boolean shouldNotNeedChangeBoundaryCase = userDao.needsPasswordChange(user01, 90, true);
            assertThat(shouldNotNeedChangeBoundaryCase).isTrue();

            userDao.changePassword(user01, "new password");
            shouldNeedChange = userDao.needsPasswordChange(user01, 200, true);
            assertThat(shouldNeedChange).isFalse();

            Boolean shouldNeedChangeBoundaryCase = userDao.needsPasswordChange(user01, 91, true);
            assertThat(shouldNeedChangeBoundaryCase).isFalse();
        } catch (SQLException e) {
            e.printStackTrace();
            fail();
        }
    }

    private static void createUserAccount(UserDao userDao, String email){
        User user = new User();
        user.setEmail(email);
        user.setState(ENABLED);
        userDao.create(user, "UserDao_IT");
        User newUser = userDao.get(email).get();
        assertThat(newUser.getState()).isEqualTo(ENABLED);
    }

    private static UserDao getUserDao(Connection conn){
        DSLContext database = DSL.using(conn, SQLDialect.MYSQL);

        // We don't care about most config for this test, so we'll pass in null
        UserDao userDao = new UserDao(null);
        userDao.setDatabase(database);
        // We're doing tests against elapsed time so we need to be able to move the clock.
        Clock clock = Clock.fixed(Instant.now(), ZoneId.systemDefault());
        userDao.setClock(clock);

        return userDao;
    }

    private static void setClockToDaysFromNow(UserDao userDao, int days){
        Instant futureInstant = Instant.now().plus(Period.ofDays(days));
        userDao.setClock(Clock.fixed(futureInstant, ZoneId.systemDefault()));
    }
}
