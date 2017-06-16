package stroom.auth.svc.resource

import com.codahale.metrics.annotation.Timed
import io.dropwizard.auth.Auth
import org.jooq.DSLContext
import org.slf4j.LoggerFactory
import stroom.auth.svc.Config
import stroom.auth.svc.security.User
import stroom.models.Tables
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

        var user = database
                .selectFrom(Tables.USR)
                .where(Tables.USR.NAME.eq(user.name))
                .single()

        return Response
                .status(Response.Status.OK)
                .build()
    }

}