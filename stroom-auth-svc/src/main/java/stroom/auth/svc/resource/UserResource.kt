package stroom.auth.svc.resource

import com.codahale.metrics.annotation.Timed
import io.dropwizard.auth.Auth
import org.jooq.DSLContext
import org.slf4j.LoggerFactory
import stroom.auth.svc.Config
import stroom.auth.svc.security.User
import stroom.db.auth.Tables
import stroom.db.auth.tables.records.UsersRecord
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
class UserResource(config: Config) {
    private var config: Config = config
    private val LOGGER = LoggerFactory.getLogger(AuthenticationResource::class.java)

    @GET
    @Path("/") // TODO query param
    @Timed
    fun getUser(@Auth user: User, @Context database: DSLContext) : Response {

        var foundUser: UsersRecord = database
                .selectFrom(Tables.USERS)
                .where(Tables.USERS.NAME.eq(user.name))
                .single()


        return Response
                .status(Response.Status.OK)
                .entity(foundUser)
                .build()
    }

}