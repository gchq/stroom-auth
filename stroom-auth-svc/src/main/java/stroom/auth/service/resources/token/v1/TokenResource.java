package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import io.dropwizard.auth.Auth;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Record1;
import org.jooq.Record11;
import org.jooq.Result;
import org.jooq.SelectJoinStep;
import org.jooq.SelectSelectStep;
import org.jooq.SortField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.AuthorisationServiceClient;
import stroom.auth.service.config.Config;
import stroom.auth.service.security.ServiceUser;
import stroom.db.auth.tables.Users;

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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.sql.Timestamp;
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
  private TokenDao tokenDao;
  private AuthorisationServiceClient authorisationServiceClient;

  @Inject
  public TokenResource(@NotNull AuthorisationServiceClient authorisationServiceClient,
                       @NotNull Config config,
                       TokenDao tokenDao) {
    this.authorisationServiceClient = authorisationServiceClient;
    this.config = config;
    this.tokenDao = tokenDao;
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
  public final Response search (
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
      orderByField = TokenDao.getOrderBy(orderBy, orderDirection);
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
        TokenDao.getSelectFrom(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

    Result<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> results =
          selectFrom
              .where(conditions.get())
              .orderBy(orderByField.get(), TOKENS.ID.asc())
              .limit(limit)
              .offset(offset)
              .fetch();
    String serialisedResults = results.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));

    // Finally we need to get the number of tokens so we can calculate the total number of pages
    SelectSelectStep<Record1<Integer>> selectCount =
        database.selectCount();
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        fromCount = TokenDao.getFrom(selectCount, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);
    int count = (Integer)fromCount
        .where(conditions.get())
        .fetchOne(0, int.class);
    // We need to round up so we always have enough pages even if there's a remainder.
    int pages= (int)Math.ceil((double) count/limit);

    String responseBody = "{\"totalPages\":\""+pages+"\", \"results\":"+serialisedResults + "}";
    return Response.status(Response.Status.OK).entity(responseBody ).build();
  }

  @POST
  @Path("/")
  @Timed
  public final Response create(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @NotNull CreateTokenRequest createTokenRequest) {

    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    // Parse and validate tokenType
    Optional<Token.TokenType> tokenTypeToCreate = createTokenRequest.getParsedTokenType();
    if(!tokenTypeToCreate.isPresent()){
      return Response.status(Response.Status.BAD_REQUEST)
        .entity("Unknown token type:" + createTokenRequest.getTokenType()).build();
    }

    String token;
    try {
      token = tokenDao.createToken(tokenTypeToCreate.get(), authenticatedServiceUser.getName(),
          createTokenRequest.getUserEmail());
    } catch (Exception e) {
      LOGGER.error(e.getMessage(), e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }

    return Response.status(Response.Status.OK).entity(token).build();
  }

  @DELETE
  @Path("/")
  @Timed
  public final Response deleteAll(@Auth @NotNull ServiceUser authenticatedServiceUser) {
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    tokenDao.deleteAllTokens();
    return Response.status(Response.Status.OK).entity("All tokens deleted").build();
  }

  @DELETE
  @Path("/{id}")
  @Timed
  public final Response delete(@Auth @NotNull ServiceUser authenticatedServiceUser,@PathParam("id") int tokenId){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    tokenDao.deleteTokenById(tokenId);
    return Response.status(Response.Status.OK).entity("Deleted token").build();
  }

  @DELETE
  @Path("/byToken/{token}")
  @Timed
  public final Response delete(@Auth @NotNull ServiceUser authenticatedServiceUser, @PathParam("token") String token){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    tokenDao.deleteTokenByTokenString(token);
    return Response.status(Response.Status.OK).entity("Deleted token").build();
  }

  @GET
  @Path("/{id}")
  @Timed
  public final Response read(@Auth @NotNull ServiceUser authenticatedServiceUser, @PathParam("id") int tokenId){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    Optional<String> tokenResult  = tokenDao.readById(tokenId);

    if(!tokenResult.isPresent()){
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    return Response.status(Response.Status.OK).entity(tokenResult.get()).build();
  }


  @GET
  @Path("/byToken/{token}")
  @Timed
  public final Response read(@Auth @NotNull ServiceUser authenticatedServiceUser, @PathParam("token") String token){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    Optional<String> tokenResult = tokenDao.readByToken(token);

    if(!tokenResult.isPresent()){
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    return Response.status(Response.Status.OK).entity(tokenResult.get()).build();
  }


  @GET
  @Path("/{id}/state")
  @Timed
  public final Response toggleEnabled(@Auth @NotNull ServiceUser authenticatedServiceUser,
                                      @NotNull @PathParam("id") int tokenId,
                                      @NotNull @QueryParam("enabled") boolean enabled) {
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    tokenDao.enableOrDisableToken(tokenId, enabled);
    return Response.status(Response.Status.OK).build();
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