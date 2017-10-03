/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources.token.v1;

import com.codahale.metrics.annotation.Timed;
import io.dropwizard.auth.Auth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.AuthorisationServiceClient;
import stroom.auth.service.config.Config;
import stroom.auth.service.resources.DaoException;
import stroom.auth.service.security.ServiceUser;

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
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.Map;
import java.util.Optional;

@Singleton
@Path("/token/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Api(description = "Stroom Auth API")
public class TokenResource {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenResource.class);

  private final Config config;
  private TokenDao tokenDao;
  private AuthorisationServiceClient authorisationServiceClient;

  @Inject
  public TokenResource(AuthorisationServiceClient authorisationServiceClient,
                       Config config,
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
  @ApiOperation(
      value = "Submit a search request for tokens",
      response = SearchResponse.class)
  public final Response search (
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @ApiParam("SearchRequest") @NotNull @Valid SearchRequest searchRequest) {
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

    SearchResponse results;
    try {
      results = tokenDao.searchTokens(searchRequest);
    } catch (DaoException e) {
      return Response.status(e.getEquivalentHttpReturnCode()).entity(e.getMessage()).build();
    }

    LOGGER.info("Returning tokens: found " + results.getTokens().size());
    return Response.status(Response.Status.OK).entity(results).build();
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
  @Path("/byToken/{token}")
  @Timed
  public final Response read(@Auth @NotNull ServiceUser authenticatedServiceUser, @PathParam("token") String token){
    if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
      return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
    }

    Optional<Token> tokenResult = tokenDao.readByToken(token);

    if(!tokenResult.isPresent()){
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    return Response.status(Response.Status.OK).entity(tokenResult.get()).build();
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
}