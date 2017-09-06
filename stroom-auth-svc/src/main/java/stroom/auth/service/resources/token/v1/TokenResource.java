package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import io.dropwizard.auth.Auth;
import org.jooq.Condition;
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
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static stroom.db.auth.Tables.TOKENS;
import static stroom.db.auth.Tables.TOKEN_TYPES;
import static stroom.db.auth.Tables.USERS;

@Singleton
@Path("/token/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
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

  @POST
  @Path("/search")
  @Timed
  public final Response search(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @NotNull SearchRequest searchRequest) {
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    // Create some vars to allow the rest of this method to be more succinct.
    int page = searchRequest.getPage();
    int limit = searchRequest.getLimit();
    String orderBy = searchRequest.getOrderBy();
    String orderDirection = searchRequest.getOrderDirection();
    Map<String, String> filters = searchRequest.getFilters();

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
    Users updatingUsers = USERS.as("updatingUsers");

    // We need to set up conditions
    List<Condition> conditions = new ArrayList<>();
    if(filters != null){
      for(String key : filters.keySet()){
        Condition condition = null;
        switch(key) {
          case "enabled":
            condition = TOKENS.ENABLED.eq(Boolean.valueOf(filters.get(key)));
            break;
          case "expires_on":
            // TODO: How do we match on this? Must match exactly? Must match part of the date? What if the given date is invalid?
            //       Is this what a user would want? Maybe they want greater than or less than? This would need additional UI
            //       We can't sensible implement anything unless we have a better idea of requirements.
            break;
          case "user_email":
            condition = tokenOwnerUsers.EMAIL.contains(filters.get(key));
            break;
          case "issued_on":
            //TODO: The same issues as applied to "expires_on" applies to this.
            break;
          case "issued_by_user":
            condition = issueingUsers.EMAIL.contains(filters.get(key));
            break;
          case "token":
            // It didn't initally make sense that one might want to filter on token, because it's encrypted.
            // But if someone has a token copy/pasting some or all of it into the search might be the
            // fastest way to find the token.
            condition = TOKENS.TOKEN.contains(filters.get(key));
            break;
          case "token_type":
            condition = TOKEN_TYPES.TOKEN_TYPE.contains(filters.get(key));
            break;
          case "updated_by_user":
            condition = updatingUsers.EMAIL.contains(filters.get(key));
            break;
          case "updated_on":
            //TODO: The same issues as applied to "expires_on" applies to this.
            break;
          case "user_id":

          default:
            return Response.status(Response.Status.BAD_REQUEST).entity("Unknown filter: " + filters.get(key)).build();
        }

        conditions.add(condition);
      }
    }

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
              .join(updatingUsers)
                .on(TOKENS.ISSUED_BY_USER.eq(updatingUsers.ID))
        .where(conditions)
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