package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import io.dropwizard.auth.Auth;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.AuthorisationServiceClient;
import stroom.auth.service.config.Config;
import stroom.auth.service.security.ServiceUser;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Singleton
@Path("/token/v1")
@Produces(MediaType.APPLICATION_JSON)
public class TokenResource {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenResource.class);

  private final Config config;
  private AuthorisationServiceClient authorisationServiceClient;

  @Inject
  public TokenResource(@NotNull AuthorisationServiceClient authorisationServiceClient,
                       @NotNull Config config) {
    this.authorisationServiceClient = authorisationServiceClient;
    this.config = config;
  }

  @GET
  @Path("/")
  @Consumes({"application/json"})
  @Produces({"application/json"})
  @Timed
  @NotNull
  public final Response welcome() {
    return Response.status(Response.Status.OK).entity("Welcome to the token registry service").build();
  }

  @GET
  @Path("/")
  @Timed
  @NotNull
  public final Response getAll(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database) {
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    // TODO get all

    return Response.status(Response.Status.OK).build();
  }


}
