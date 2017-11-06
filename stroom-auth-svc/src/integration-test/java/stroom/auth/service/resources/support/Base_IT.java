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

package stroom.auth.service.resources.support;

import io.dropwizard.testing.junit.DropwizardAppRule;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.junit.After;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import stroom.auth.service.App;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;

import static stroom.db.auth.Tables.TOKENS;
import static stroom.db.auth.Tables.TOKEN_TYPES;
import static stroom.db.auth.Tables.USERS;

public abstract class Base_IT {

    @ClassRule
    public static final DropwizardAppRule appRule = new DropwizardAppRule(App.class, "config.yml");

    protected static String BASE_TASKS_URL;
    protected static String HEALTH_CHECKS_URL;

    protected static int appPort;
    protected static int adminPort;

    protected static UserManager userManager = new UserManager();
    protected static AuthenticationManager authenticationManager = new AuthenticationManager();
    protected static TokenManager tokenManager = new TokenManager();

    /**
     * We need to delete any tokens or users we've created, otherwise future tests on the same stack might fail.
     */
    @After
    public void after(){
        try (Connection conn = DriverManager.getConnection("jdbc:mariadb://localhost:3309/auth", "stroomuser", "stroompassword1")) {
            DSLContext database = DSL.using(conn, SQLDialect.MARIADB);

            // Delete non-admin users
            database.deleteFrom(USERS).where(USERS.EMAIL.ne("admin")).execute();
            Integer adminUserId = database.select(USERS.ID).from(USERS).where(USERS.EMAIL.eq("admin")).fetchOne()
                    .into(Integer.class);
            Integer apiTokenTypeID = database.select(TOKEN_TYPES.ID).from(TOKEN_TYPES)
                    .where(TOKEN_TYPES.TOKEN_TYPE.eq("api")).fetchOne().into(Integer.class);
            database.deleteFrom(TOKENS).execute();

            database.insertInto(TOKENS)
                    // This is the long-lived token from Flyway
                .set(TOKENS.TOKEN, "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InN0cm9vbSJ9.NLTH0YNedtKsco0E6jWTcPYV3AW2mLlgLf5TVxXVa-I")
                .set(TOKENS.TOKEN_TYPE_ID, apiTokenTypeID)
                .set(TOKENS.USER_ID, adminUserId)
                .set(TOKENS.ISSUED_ON, Timestamp.from(Instant.now()))
                    .execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    @BeforeClass
    public static void setupClass() throws InterruptedException {
        appPort = appRule.getLocalPort();
        authenticationManager.setPort(appPort);
        userManager.setPort(appPort);
        tokenManager.setPort(appPort);

        adminPort = appRule.getAdminPort();
        BASE_TASKS_URL = "http://localhost:" + adminPort + "/tasks/";
        HEALTH_CHECKS_URL = "http://localhost:" + adminPort + "/healthcheck?pretty=true";
        Thread.sleep(2000);
    }
}
