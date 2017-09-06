package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import io.dropwizard.auth.Auth;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Record;
import org.jooq.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.AuthorisationServiceClient;
import stroom.auth.service.config.Config;
import stroom.auth.service.security.ServiceUser;
import stroom.db.auth.tables.records.TokensRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.validation.constraints.NotNull;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import static stroom.db.auth.Tables.TOKENS;
import static stroom.db.auth.Tables.TOKEN_TYPES;
import static stroom.db.auth.Tables.USERS;

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
  @Timed
  public final Response search(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @NotNull @QueryParam("page") int page,
      @NotNull @QueryParam("limit") int limit,
      @NotNull @QueryParam("orderBy") String orderBy) {
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    int offset = limit * page;
    String result = database
        .selectFrom(TOKENS)
        .orderBy(TOKENS.field(orderBy), TOKENS.ID)
        .limit(limit)
        .offset(offset)
        .fetch()
        .formatJSON(new JSONFormat().header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));

    return Response.status(Response.Status.OK).entity(result).build();
  }

  @POST
  @Path("/")
  @Timed
  public final Response create(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @NotNull Token token) {

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    Record usersRecord = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(token.getUserEmail()))
        .fetchOne();

    Record tokenTypesRecord = database
        .select(TOKEN_TYPES.ID)
        .from(TOKEN_TYPES)
        .where(TOKEN_TYPES.TOKENTYPE.eq(token.getTokenType()))
        .fetchOne();

    TokensRecord tokensRecord = (TokensRecord) database
        .insertInto((Table) TOKENS)
        .set(TOKENS.USER_ID, usersRecord.get(USERS.ID))
        .set(TOKENS.TOKEN_TYPE_ID, tokenTypesRecord.get(TOKEN_TYPES.ID))
        .set(TOKENS.TOKEN, token.getToken())
        .set(TOKENS.EXPIRES_ON, token.getExpiresOn())
        .set(TOKENS.ISSUED_ON, token.getIssuedOn())
        .set(TOKENS.ISSUED_BY_USER, token.getIssuedByUser())
        .set(TOKENS.ENABLED, token.isEnabled())
        .set(TOKENS.UPDATED_ON, token.getUpdatedOn())
        .set(TOKENS.UPDATED_BY_USER, token.getUpdatedByUser())
        .returning(new Field[]{TOKENS.ID}).fetchOne();

    return Response.status(Response.Status.OK).entity(tokensRecord.getId()).build();
  }

  @DELETE
  @Path("/")
  @Timed
  public final Response deleteAll(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database) {

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    database.deleteFrom(TOKENS).execute();

    return Response.status(Response.Status.OK).entity("All tokens deleted").build();
  }

}