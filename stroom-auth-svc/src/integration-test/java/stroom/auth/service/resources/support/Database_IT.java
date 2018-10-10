package stroom.auth.service.resources.support;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.junit.After;
import org.junit.Before;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;

import static stroom.db.auth.Tables.TOKENS;
import static stroom.db.auth.Tables.TOKEN_TYPES;
import static stroom.db.auth.Tables.USERS;

/**
 * A belt and braces approach to cleaning the database. It's not an expensive operation and doing it before
 * and after a test guarantees we won't run into issues with existing data.
 */
public abstract class Database_IT {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(Database_IT.class);

    private static final String JDBC_URL = "jdbc:mysql://localhost:3307/auth?useUnicode=yes&characterEncoding=UTF-8";
    private static final String JDBC_USER = "authuser";
    private static final String JDBC_PASSWORD = "stroompassword1";

    @After
    public void after(){
        cleanDatabase();
    }

    @Before
    public void before() {
        cleanDatabase();
    }

    private void cleanDatabase(){
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            DSLContext database = DSL.using(conn, SQLDialect.MYSQL);

            // Delete non-admin users
            database.deleteFrom(USERS).where(USERS.EMAIL.ne("admin")).execute();
            Integer adminUserId = database
                    .select(USERS.ID)
                    .from(USERS)
                    .where(USERS.EMAIL.eq("admin"))
                    .fetchOne()
                    .into(Integer.class);

            Integer apiTokenTypeID = database
                    .select(TOKEN_TYPES.ID)
                    .from(TOKEN_TYPES)
                    .where(TOKEN_TYPES.TOKEN_TYPE.eq("api"))
                    .fetchOne()
                    .into(Integer.class);

            database.deleteFrom(TOKENS).execute();

            database.insertInto(TOKENS)
                    // This is the long-lived token from Flyway
                    .set(TOKENS.TOKEN,
                            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InN0cm9vbSJ9.NLTH0YNedtKsco0E6jWTcPYV3AW2mLlgLf5TVxXVa-I")
                    .set(TOKENS.TOKEN_TYPE_ID, apiTokenTypeID)
                    .set(TOKENS.USER_ID, adminUserId)
                    .set(TOKENS.ISSUED_ON, Timestamp.from(Instant.now()))
                    .execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
