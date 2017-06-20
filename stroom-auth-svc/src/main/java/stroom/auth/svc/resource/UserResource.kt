package stroom.auth.svc.resource

import com.codahale.metrics.annotation.Timed
import io.dropwizard.auth.Auth
import org.jooq.DSLContext
import org.jooq.JSONFormat
import org.slf4j.LoggerFactory
import stroom.auth.svc.Config
import stroom.auth.svc.security.User
import stroom.db.auth.Tables
import stroom.db.auth.Tables.USERS
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
class UserResource(config: Config) {
    private var config: Config = config
    private val LOGGER = LoggerFactory.getLogger(AuthenticationResource::class.java)

    @GET
    @Path("/")
    @Timed
    fun getAllUsers(
            @Auth authenticatedUser: User,
            @Context database: DSLContext,
            @QueryParam("fromUsername") fromUsername: String,
            @QueryParam("usersPerPage") usersPerPage: Int,
            @QueryParam("orderBy") orderBy: String) : Response {

        val orderByField = USERS.field(orderBy) ?:
            return Response
                .status(Response.Status.BAD_REQUEST)
                .entity("Unknown orderBy field")
                .build()
        if(usersPerPage <=0 || usersPerPage >= 100) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("usersPerPage must be between 0-100")
                    .build()
        }
        if(database.select(USERS.ID).from(USERS).fetch().isEmpty()) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("fromUsername does not refer to a user that exists in the database")
                    .build()
        }

        val users = database
                .select(USERS.ID,
                        USERS.NAME,
                        USERS.TOTAL_LOGIN_FAILURES,
                        USERS.LAST_LOGIN,
                        USERS.UPDATED_ON,
                        USERS.UPDATED_BY_USER,
                        USERS.CREATED_ON,
                        USERS.CREATED_BY_USER)
                .from(USERS)
                .orderBy(USERS.NAME)
                .seekAfter(fromUsername)
                .limit(usersPerPage)
                .fetch()
                .formatJSON(JSONFormat().header(false).recordFormat(JSONFormat.RecordFormat.OBJECT))

        return Response
                .status(Response.Status.OK)
                .entity(users)
                .build()
    }

    @GET
    @Path("/me")
    @Timed
    fun getCurrentUser(@Auth user: User, @Context database: DSLContext) : Response {

        val foundUser = database
                .select(
                        USERS.ID,
                        USERS.NAME,
                        USERS.TOTAL_LOGIN_FAILURES,
                        USERS.LAST_LOGIN,
                        USERS.UPDATED_ON,
                        USERS.UPDATED_BY_USER,
                        USERS.CREATED_ON,
                        USERS.CREATED_BY_USER)
                .from(USERS)
                .where(USERS.NAME.eq(user.name))
                .fetch()
                .formatJSON(JSONFormat().header(false).recordFormat(JSONFormat.RecordFormat.OBJECT))

        return Response
                .status(Response.Status.OK)
                .entity(foundUser)
                .build()
    }


}