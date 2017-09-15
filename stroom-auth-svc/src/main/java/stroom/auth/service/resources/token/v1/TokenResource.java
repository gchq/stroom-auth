package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import io.dropwizard.auth.Auth;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Record1;
import org.jooq.Record11;
import org.jooq.Result;
import org.jooq.SelectJoinStep;
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
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

  /**
   * Default ordering is by ISSUED_ON date, in descending order so the most recent tokens are shown first.
   * If orderBy is specified but orderDirection is not this will default to ascending.
   *
   * The user must have the 'Manage Users' permission to call this.
   */
  @POST
  @Path("/search")
  @Timed
  public final Response search(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @NotNull @Valid SearchRequest searchRequest) {
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

    // Validate filters
    if(filters != null) {
      for (String key : filters.keySet()) {
        switch (key) {
          case "expires_on":
          case "issued_on":
          case "updated_on":
            return Response.status(Response.Status.BAD_REQUEST).entity("Filtering by date is not supported.").build();
        }
      }
    }

    // We need these aliased tables because we're joining tokens to users twice.
    Users issueingUsers = USERS.as("issueingUsers");
    Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");
    Users updatingUsers = USERS.as("updatingUsers");

    Field userEmail = tokenOwnerUsers.EMAIL.as("user_email");
    // Special cases
    Optional<SortField> orderByField;
    if(orderBy != null && orderBy.equals("user_email")){
      // Why is this a special case? Because the property on the target table is 'email' but the param is 'user_email'
      // 'user_email' is a clearer param
      if(orderDirection.equals("asc")){
        orderByField = Optional.of(userEmail.asc());
      }
      else {
        orderByField = Optional.of(userEmail.desc());
      }
    }
    else {
      orderByField = getOrderBy(orderBy, orderDirection);
      if (!orderByField.isPresent()) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Invalid orderBy: " + orderBy).build();
      }
    }

    Optional<List<Condition>> conditions;
    try {
      conditions = getConditions(filters, issueingUsers, tokenOwnerUsers, updatingUsers);
    } catch(Exception ex){
      return Response.status(422).entity(ex.getMessage()).build();
    }

    int offset = limit * page;
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> selectFrom =
        getSelectFrom(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

    Result<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> results =
          selectFrom
              .where(conditions.get())
              .orderBy(orderByField.get(), TOKENS.ID.asc())
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

    Record1<Integer> userRecord = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(token.getUser_email()))
        .fetchOne();
    if(userRecord == null){
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("Cannot find user to associate with this token!").build();
    }
    int userId = userRecord.get(USERS.ID);

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

  @DELETE
  @Path("/{id}")
  @Timed
  public final Response delete(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @PathParam("id") int tokenId){

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    database.deleteFrom(TOKENS).where(TOKENS.ID.eq(tokenId)).execute();

    return Response.status(Response.Status.OK).entity("Deleted token").build();
  }

  @GET
  @Path("/{id}")
  @Timed
  public final Response read(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @PathParam("id") int tokenId){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }
    // We need these aliased tables because we're joining tokens to users twice.
    Users issueingUsers = USERS.as("issueingUsers");
    Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");
    Users updatingUsers = USERS.as("updatingUsers");

    Field userEmail = tokenOwnerUsers.EMAIL.as("user_email");
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> selectFrom =
        getSelectFrom(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

    Result<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        result = selectFrom
        .where(new Condition[]{TOKENS.ID.eq(Integer.valueOf(tokenId))})
        .fetch();

    if(result.isEmpty()){
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    // We only need to check auth permissions if the user is trying to access a different user.
    String tokenUser = (String)result.get(0).get("user_email");
    boolean isUserAccessingThemselves = authenticatedServiceUser.getName().equals(tokenUser);
    if (!isUserAccessingThemselves) {
      if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
        return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
      }
    }

    String serialisedResults = result.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));
    return Response.status(Response.Status.OK).entity(serialisedResults).build();
  }

  private static SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> getSelectFrom(DSLContext database, Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail){
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> selectFrom =
        database.select(
            TOKENS.ID.as("id"),
            TOKENS.ENABLED.as("enabled"),
            TOKENS.EXPIRES_ON.as("expires_on"),
            userEmail,
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
                    .on(TOKENS.USER_ID.eq(tokenOwnerUsers.ID))
                    .join(updatingUsers)
                    .on(TOKENS.ISSUED_BY_USER.eq(updatingUsers.ID)));
    return selectFrom;
  }


  private static Optional<SortField> getOrderBy(String orderBy, String orderDirection) {
    // We might be ordering by TOKENS or USERS or TOKEN_TYPES - we join and select on all
    SortField orderByField;
    if(orderBy != null){
      // We have an orderBy...
      if(TOKENS.field(orderBy) != null) {
        //... and this orderBy is from TOKENS...
        if (Strings.isNullOrEmpty(orderDirection)) {
          // ... but we don't have an orderDirection
          orderByField = TOKENS.field(orderBy).asc();
        } else {
          // ... and we do have an order direction
          orderByField = orderDirection.toLowerCase().equals("asc") ? TOKENS.field(orderBy).asc() : TOKENS.field(orderBy).desc();
        }
      }
      else if(USERS.field(orderBy) != null){
        //... and this orderBy is from USERS
        if (Strings.isNullOrEmpty(orderDirection)) {
          //... but we don't have an orderDirection
          orderByField = USERS.field(orderBy).asc();
        } else {
          // ... and we do have an order direction
          orderByField = orderDirection.toLowerCase().equals("asc") ? USERS.field(orderBy).asc() : USERS.field(orderBy).desc();
        }
      }
      else if(TOKEN_TYPES.field(orderBy) != null){
        //... and this orderBy is from TOKEN_TYPES
        if (Strings.isNullOrEmpty(orderDirection)) {
          //... but we don't have an orderDirection
          orderByField = TOKEN_TYPES.field(orderBy).asc();
        } else {
          // ... and we do have an order direction
          orderByField = orderDirection.toLowerCase().equals("asc") ? TOKEN_TYPES.field(orderBy).asc() : TOKEN_TYPES.field(orderBy).desc();
        }
      }
      else {
        // ... but we couldn't match it to anything
        return Optional.empty();
      }
    }
    else{
      // We don't have an orderBy so we'll use the default ordering
      orderByField = TOKENS.ISSUED_ON.desc();
    }
    return Optional.of(orderByField);
  }

  /**
   * How do we match on dates? Must match exactly? Must match part of the date? What if the given date is invalid?
   * Is this what a user would want? Maybe they want greater than or less than? This would need additional UI
   * For now we can't sensible implement anything unless we have a better idea of requirements.
   */
  private static Optional<List<Condition>> getConditions(Map<String, String> filters, Users issueingUsers,
                                                         Users tokenOwnerUsers, Users updatingUsers) throws Exception {
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
            throw new Exception("Unsupported filter: " + key);
          case "user_email":
            condition = tokenOwnerUsers.EMAIL.contains(filters.get(key));
            break;
          case "issued_on":
            throw new Exception("Unsupported filter: " + key);
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
            throw new Exception("Unsupported filter: " + key);
          case "user_id":
            throw new Exception("Unsupported filter: " + key);
          default:
            throw new Exception("Unknown filter: " + key);
        }

        conditions.add(condition);
      }
    }
    return Optional.of(conditions);
  }
}