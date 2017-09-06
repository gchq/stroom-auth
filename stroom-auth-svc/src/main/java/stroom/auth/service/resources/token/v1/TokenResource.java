package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import io.dropwizard.auth.Auth;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Record11;
import org.jooq.Result;
import org.jooq.SortField;
import org.jooq.Table;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.AuthorisationServiceClient;
import stroom.auth.service.config.Config;
import stroom.auth.service.security.ServiceUser;
import stroom.db.auth.tables.Users;
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

import java.sql.Timestamp;
import java.time.Instant;

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
      @NotNull @QueryParam("orderBy") String orderBy,
      @QueryParam("orderDirection") String orderDirection) {
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    // Check the user is authorised to call this
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    // Validate orderDirection field
    if(!Strings.isNullOrEmpty(orderDirection) && !orderDirection.equals("asc") && !orderDirection.equals("desc")){
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid orderDirection: " + orderDirection).build();
    }

    // Validate orderBy field
    if(TOKENS.field(orderBy) == null){
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid orderBy: " + orderBy).build();
    }

    // Figure out ordering field
    SortField orderByField = TOKENS.field(orderBy).asc();
    if(!Strings.isNullOrEmpty(orderDirection)) {
      orderByField = orderDirection.equals("asc") ? TOKENS.field(orderBy).asc() : TOKENS.field(orderBy).desc() ;
    }

    // We need these aliased tables because we're joining tokens to users twice.
    Users issueingUsers = USERS.as("issueingUsers");
    Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");

    int offset = limit * page;
    Result<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> results = database
        .select(
            TOKENS.ID.as("id"),
            TOKENS.ENABLED.as("enabled"),
            TOKENS.EXPIRES_ON.as("expires_on"),
            tokenOwnerUsers.EMAIL.as("user_email"),
            TOKENS.ISSUED_ON.as("issued_on"),
            issueingUsers.EMAIL.as("issued_by_user"),
            TOKENS.TOKEN.as("token"),
            TOKEN_TYPES.TOKEN_TYPE.as("token_type"),
            TOKENS.UPDATED_BY_USER.as("updated_by_user"),
            TOKENS.UPDATED_ON.as("updated_on"),
            TOKENS.USER_ID.as("user_id"))
        .from(
            TOKENS
              .join(TOKEN_TYPES)
              .on(TOKENS.TOKEN_TYPE_ID.eq(TOKEN_TYPES.ID))
              .join(issueingUsers)
              .on(TOKENS.ISSUED_BY_USER.eq(issueingUsers.ID))
              .join(tokenOwnerUsers)
              .on(TOKENS.USER_ID.eq(tokenOwnerUsers.ID)))
        .orderBy(orderByField, TOKENS.ID.asc())
        .limit(limit)
        .offset(offset)
        .fetch();

    String serialisedResults = results.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));

    return Response.status(Response.Status.OK).entity(serialisedResults).build();
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

    int userId = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(token.getUser_email()))
        .fetchOne()
        .get(USERS.ID);

    int issueingUserId = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(authenticatedServiceUser.getName()))
        .fetchOne()
        .get(USERS.ID);

    int tokenTypeId = database
        .select(TOKEN_TYPES.ID)
        .from(TOKEN_TYPES)
        .where(TOKEN_TYPES.TOKEN_TYPE.eq(token.getToken_type()))
        .fetchOne()
        .get(TOKEN_TYPES.ID);



    TokensRecord tokensRecord = (TokensRecord) database
        .insertInto((Table) TOKENS)
        .set(TOKENS.USER_ID, userId)
        .set(TOKENS.TOKEN_TYPE_ID, tokenTypeId)
        .set(TOKENS.TOKEN, token.getToken())
        .set(TOKENS.EXPIRES_ON, token.getExpires_on()) //TODO decode token and get expiry date
        .set(TOKENS.ISSUED_ON, Instant.now() )
        .set(TOKENS.ISSUED_BY_USER, issueingUserId)
        .set(TOKENS.ENABLED, token.isEnabled())
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