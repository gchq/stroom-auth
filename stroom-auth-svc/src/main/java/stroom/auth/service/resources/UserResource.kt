package stroom.auth.service.resources

import com.codahale.metrics.annotation.Timed
import io.dropwizard.auth.Auth
import org.jooq.DSLContext
import org.jooq.JSONFormat
import org.slf4j.LoggerFactory
import stroom.auth.service.Config
import stroom.auth.service.security.ServiceUser
import stroom.db.auth.Tables.USERS
import java.sql.Timestamp
import java.time.Instant
import javax.ws.rs.*
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
            @Auth authenticatedServiceUser: ServiceUser,
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

        val orderByNameField = USERS.NAME

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
//                .orderBy(USERS.NAME)
                .orderBy(orderByNameField)
                .seekAfter(fromUsername)
                .limit(usersPerPage)
                .fetch()
                .formatJSON(JSONFormat().header(false).recordFormat(JSONFormat.RecordFormat.OBJECT))

        //TODO finish ordering

        return Response
                .status(Response.Status.OK)
                .entity(users)
                .build()
    }

    @GET
    @Path("/me")
    @Timed
    fun getCurrentUser(@Auth authenticatedServiceUser: ServiceUser, @Context database: DSLContext) : Response {
        val foundUserRecord = database
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
                .where(USERS.NAME.eq(authenticatedServiceUser.name))
                .fetchOne()

        // We can use formatJSON() on Results (when using fetch()) but not yet on Records (when using fetchOne().
        // The below is a work around. Something like formatJSON() should be available when using fetchOne() by Q3 2017.
        // NB: This still means
        // See https@ //github.com/jOOQ/jOOQ/issues/6354#issuecomment-310103896
        val foundUserResult = database.newResult(USERS.ID,
                USERS.NAME,
                USERS.TOTAL_LOGIN_FAILURES,
                USERS.LAST_LOGIN,
                USERS.UPDATED_ON,
                USERS.UPDATED_BY_USER,
                USERS.CREATED_ON,
                USERS.CREATED_BY_USER)
        foundUserResult.add(foundUserRecord)
        val foundUserJson = foundUserResult.formatJSON(
                JSONFormat().header(false).recordFormat(JSONFormat.RecordFormat.OBJECT))

        return Response
                .status(Response.Status.OK)
                .entity(foundUserJson).build()
    }

    @POST
    @Path("/")
    @Timed
    fun createUser(@Auth authenticatedServiceUser: ServiceUser, @Context database: DSLContext, user: User?) : Response {
        if(user == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Please supply a user").build()
        }

        val usersRecord =
                database.insertInto(USERS)
                    .set(USERS.NAME, user.name)
                    .set(USERS.PASSWORD_HASH, "TODO HASH")
                    .set(USERS.CREATED_ON, Timestamp.from(Instant.now()))
                    .set(USERS.CREATED_BY_USER, authenticatedServiceUser.name)
                    .returning(USERS.ID)
                    .fetchOne()

        return Response
                .status(Response.Status.OK)
                .entity(usersRecord.id).build()
    }


}