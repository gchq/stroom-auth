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

import static org.assertj.core.api.Assertions.assertThat;

public class UserDao_IT extends Database_IT {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(UserDao_IT.class);

    @Test
    public void testNewButInactiveUserIsDisabled(){
        try (Connection conn = DriverManager.getConnection("jdbc:mariadb://localhost:3309/auth", "stroomuser", "stroompassword1")) {
            // GIVEN...
            UserDao userDao = getUserDao(conn);

            // Create a test user who should be disabled
            createInactiveNewUser(userDao, "user01");

            // Create a user who would be disabled if they hadn't logged in already
            createInactiveUser(userDao, "user02");

            // Advance the clock and create a test user who shouldn't be disabled
            advanceClockFromTestStart(userDao, 10);
            createInactiveNewUser(userDao, "user03");

            // WHEN...
            advanceClockFromTestStart(userDao, 30);
            int numberOfDisabledUsers = userDao.disableNewInactiveUsers(30);

            // THEN...
            assertThat(numberOfDisabledUsers).isEqualTo(1);
            assertThat(userDao.get("user01").getState()).isEqualTo("disabled");
            assertThat(userDao.get("user02").getState()).isEqualTo("enabled");
            assertThat(userDao.get("user03").getState()).isEqualTo("enabled");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testInactiveUserIsDisabled(){
        try (Connection conn = DriverManager.getConnection("jdbc:mariadb://localhost:3309/auth", "stroomuser", "stroompassword1")) {
            // GIVEN...
            UserDao userDao = getUserDao(conn);

            // Create a test user who should be disabled
            createInactiveUser(userDao, "user01");

            // Advance the clock and create a test user who shouldn't be disabled
            advanceClockFromTestStart(userDao, 10);
            createInactiveUser(userDao, "user02");

            // WHEN...
            advanceClockFromTestStart(userDao, 90);
            int numberOfDisabledUsers = userDao.disableInactiveUsers(90);

            // THEN...
            assertThat(numberOfDisabledUsers).isEqualTo(1);
            assertThat(userDao.get("user01").getState()).isEqualTo("disabled");
            assertThat(userDao.get("user02").getState()).isEqualTo("enabled");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void createInactiveNewUser(UserDao userDao, String email){
        User user = new User();
        user.setEmail(email);
        user.setState("enabled");
        userDao.create(user, "UserDao_IT");
        User newUser = userDao.get(email);
        assertThat(newUser.getState()).isEqualTo("enabled");
    }

    private static void createInactiveUser(UserDao userDao, String email){
        User user = new User();
        user.setEmail(email);
        user.setState("enabled");
        userDao.create(user, "UserDao_IT");
        userDao.recordSuccessfulLogin(email);
        User newUser = userDao.get(email);
        assertThat(newUser.getState()).isEqualTo("enabled");
    }

    private static UserDao getUserDao(Connection conn){
        DSLContext database = DSL.using(conn, SQLDialect.MARIADB);

        // We don't care about most config for this test, so we'll pass in null
        UserDao userDao = new UserDao(null);
        userDao.setDatabase(database);
        // We're doing tests against elapsed time so we need to be able to move the clock.
        Clock clock = Clock.fixed(Instant.now(), ZoneId.systemDefault());
        userDao.setClock(clock);

        return userDao;
    }

    private static void advanceClockFromTestStart(UserDao userDao, int days){
        Instant thirtyDaysTime = Instant.now().plus(Period.ofDays(days));
        userDao.setClock(Clock.fixed(thirtyDaysTime, ZoneId.systemDefault()));
    }
}
