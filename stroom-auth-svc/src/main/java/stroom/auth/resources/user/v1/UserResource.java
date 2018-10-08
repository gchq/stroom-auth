/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.resources.user.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import event.logging.Data;
import event.logging.Event;
import event.logging.ObjectOutcome;
import io.dropwizard.auth.Auth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.lang3.tuple.Pair;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.JSONFormat;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.Table;
import org.jooq.TableField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.AuthorisationServiceClient;
import stroom.auth.daos.UserDao;
import stroom.auth.daos.UserMapper;
import stroom.auth.service.eventlogging.StroomEventLoggingService;
import stroom.auth.service.security.ServiceUser;
import stroom.db.auth.tables.records.UsersRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.time.ZonedDateTime;

import static stroom.db.auth.Tables.USERS;

@Singleton
@Path("/user/v1")
@Produces({"application/json"})
@Api(description = "Stroom User API", tags = {"User"})
public final class UserResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserResource.class);

    private AuthorisationServiceClient authorisationServiceClient;
    private UserDao userDao;
    private StroomEventLoggingService stroomEventLoggingService;

    @Inject
    public UserResource(
            @NotNull AuthorisationServiceClient authorisationServiceClient,
            UserDao userDao,
            final StroomEventLoggingService stroomEventLoggingService) {
        super();
        this.authorisationServiceClient = authorisationServiceClient;
        this.userDao = userDao;
        this.stroomEventLoggingService = stroomEventLoggingService;
    }

    @ApiOperation(
            value = "Get all users.",
            response = String.class,
            tags = {"User"})
    @GET
    @Path("/")
    @Timed
    @NotNull
    public final Response getAll(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database) {
        Preconditions.checkNotNull(authenticatedServiceUser);
        Preconditions.checkNotNull(database);

        if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
        }

        TableField orderByEmailField = USERS.EMAIL;
        String usersAsJson = database
                .selectFrom(USERS)
                .orderBy(orderByEmailField)
                .fetch()
                .formatJSON((new JSONFormat())
                        .header(false)
                        .recordFormat(JSONFormat.RecordFormat.OBJECT));

        Data data = new Data();
        data.setName("All users as JSON");
        data.setValue(usersAsJson);
        ObjectOutcome objectOutcome = new ObjectOutcome();
        objectOutcome.getData().add(data);
        stroomEventLoggingService.view(
                httpServletRequest,
                authenticatedServiceUser.getName(),
                objectOutcome,
                "Read all users.");

        return Response.status(Response.Status.OK).entity(usersAsJson).build();
    }

    @ApiOperation(
            value = "Create a user.",
            response = Integer.class,
            tags = {"User"})
    @POST
    @Path("/")
    @Timed
    @NotNull
    public final Response createUser(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database,
            @ApiParam("user") @NotNull User user) {
        // Validate
        Preconditions.checkNotNull(authenticatedServiceUser);
        Preconditions.checkNotNull(database);

        if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
        }

        Pair<Boolean, String> validationResults = User.isValidForCreate(user);
        boolean isUserValid = validationResults.getLeft();
        if (!isUserValid) {
            return Response.status(Response.Status.BAD_REQUEST).entity(validationResults.getRight()).build();
        }

        if (doesUserAlreadyExist(database, user.getEmail())) {
            return Response.status(Response.Status.CONFLICT).entity(UserValidationError.USER_ALREADY_EXISTS).build();
        }

        if (Strings.isNullOrEmpty(user.getState())) {
            user.setState(User.UserState.ENABLED.getStateText());
        }

        int newUserId = userDao.create(user, authenticatedServiceUser.getName());

        Data data = new Data();
        data.setName(user.getEmail());
        ObjectOutcome objectOutcome = new ObjectOutcome();
        objectOutcome.getData().add(data);
        stroomEventLoggingService.create(
                httpServletRequest,
                authenticatedServiceUser.getName(),
                objectOutcome,
                "Create a user");


        return Response.status(Response.Status.OK).entity(newUserId).build();
    }

    @ApiOperation(
            value = "Get the details of the currently logged-in user.",
            response = String.class,
            tags = {"User"})
    @GET
    @Path("/me")
    @Timed
    @NotNull
    public final Response readCurrentUser(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database) {
        // Validate
        Preconditions.checkNotNull(authenticatedServiceUser);
        Preconditions.checkNotNull(database);

        // We're not checking authorisation because the current user is allowed to get infomation about themselves.

        // Get the user
        Record foundUserRecord = database
                .select(USERS.ID,
                        USERS.EMAIL,
                        USERS.LOGIN_FAILURES,
                        USERS.LAST_LOGIN,
                        USERS.UPDATED_ON,
                        USERS.UPDATED_BY_USER,
                        USERS.CREATED_ON,
                        USERS.CREATED_BY_USER)
                .from(USERS)
                .where(new Condition[]{USERS.EMAIL.eq(authenticatedServiceUser.getName())}).fetchOne();
        Result foundUserResult = database
                .newResult(
                        USERS.ID,
                        USERS.EMAIL,
                        USERS.LOGIN_FAILURES,
                        USERS.LAST_LOGIN,
                        USERS.UPDATED_ON,
                        USERS.UPDATED_BY_USER,
                        USERS.CREATED_ON,
                        USERS.CREATED_BY_USER);
        foundUserResult.add(foundUserRecord);
        String foundUserJson = foundUserResult.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));


        Data data = new Data();
        data.setName(foundUserRecord.get(USERS.EMAIL));
        ObjectOutcome objectOutcome = new ObjectOutcome();
        objectOutcome.getData().add(data);
        stroomEventLoggingService.view(
                httpServletRequest,
                authenticatedServiceUser.getName(),
                objectOutcome,
                "Read the current user.");

        Response response = Response.status(Response.Status.OK).entity(foundUserJson).build();
        return response;
    }

    @ApiOperation(
            value = "Get a user by ID.",
            response = String.class,
            tags = {"User"})
    @GET
    @Path("{id}")
    @Timed
    @NotNull
    public final Response getUser(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database,
            @PathParam("id") int userId) {
        // Validate
        Preconditions.checkNotNull(authenticatedServiceUser);
        Preconditions.checkNotNull(database);

        // Get the user
        Record foundUserRecord = database
                .select(USERS.ID,
                        USERS.EMAIL,
                        USERS.FIRST_NAME,
                        USERS.LAST_NAME,
                        USERS.COMMENTS,
                        USERS.STATE,
                        USERS.LOGIN_FAILURES,
                        USERS.LOGIN_COUNT,
                        USERS.LAST_LOGIN,
                        USERS.UPDATED_ON,
                        USERS.UPDATED_BY_USER,
                        USERS.CREATED_ON,
                        USERS.CREATED_BY_USER)
                .from(USERS)
                .where(new Condition[]{USERS.ID.eq(userId)})
                .fetchOne();
        Response response;
        if (foundUserRecord == null) {
            response = Response.status(Response.Status.NOT_FOUND).build();
            return response;
        } else {

            // We only need to check auth permissions if the user is trying to access a different user.
            String foundUserEmail = foundUserRecord.get(USERS.EMAIL);
            boolean isUserAccessingThemselves = authenticatedServiceUser.getName().equals(foundUserEmail);
            if (!isUserAccessingThemselves) {
                if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
                    return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
                }
            }

            Result foundUserResult = database.newResult(
                    USERS.ID,
                    USERS.EMAIL,
                    USERS.FIRST_NAME,
                    USERS.LAST_NAME,
                    USERS.COMMENTS,
                    USERS.STATE,
                    USERS.LOGIN_FAILURES,
                    USERS.LOGIN_COUNT,
                    USERS.LAST_LOGIN,
                    USERS.UPDATED_ON,
                    USERS.UPDATED_BY_USER,
                    USERS.CREATED_ON,
                    USERS.CREATED_BY_USER);
            foundUserResult.add(foundUserRecord);
            String foundUserJson = foundUserResult
                    .formatJSON((new JSONFormat())
                            .header(false)
                            .recordFormat(JSONFormat.RecordFormat.OBJECT));

            Data data = new Data();
            data.setName(foundUserRecord.get(USERS.EMAIL));
            ObjectOutcome objectOutcome = new ObjectOutcome();
            objectOutcome.getData().add(data);
            stroomEventLoggingService.view(
                    httpServletRequest,
                    authenticatedServiceUser.getName(),
                    objectOutcome,
                    "Read a specific user.");

            response = Response.status(Response.Status.OK).entity(foundUserJson).build();
            return response;
        }
    }

    @ApiOperation(
            value = "Update a user.",
            response = String.class,
            tags = {"User"})
    @PUT
    @Path("{id}")
    @Timed
    @NotNull
    public final Response updateUser(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database,
            @ApiParam("user") @NotNull User user,
            @PathParam("id") int userId) {
        UsersRecord usersRecord = (UsersRecord) database
                .selectFrom((Table) USERS)
                .where(new Condition[]{USERS.ID.eq(userId)})
                .fetchOne();

        // We only need to check auth permissions if the user is trying to access a different user.
        String foundUserEmail = usersRecord.get(USERS.EMAIL);
        boolean isUserAccessingThemselves = authenticatedServiceUser.getName().equals(foundUserEmail);
        if (!isUserAccessingThemselves) {
            if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
                return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
            }
        }

        user.setUpdated_by_user(authenticatedServiceUser.getName());
        user.setUpdated_on(ZonedDateTime.now().toString());
        UsersRecord updatedUsersRecord = UserMapper.updateUserRecordWithUser(user, usersRecord);
        database
                .update((Table) USERS)
                .set(updatedUsersRecord)
                .where(new Condition[]{USERS.ID.eq(userId)}).execute();

        Event.EventDetail.Update update = new Event.EventDetail.Update();
        stroomEventLoggingService.update(
                httpServletRequest,
                authenticatedServiceUser.getName(),
                update,
                "Toggle whether a token is enabled or not.");

        Response response = Response.status(Response.Status.OK).build();
        return response;
    }

    @ApiOperation(
            value = "Delete a user by ID.",
            response = String.class,
            tags = {"User"})
    @DELETE
    @Path("{id}")
    @Timed
    @NotNull
    public final Response deleteUser(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @Auth @NotNull ServiceUser authenticatedServiceUser,
            @Context @NotNull DSLContext database,
            @PathParam("id") int userId) {
        // Validate
        Preconditions.checkNotNull(authenticatedServiceUser);
        Preconditions.checkNotNull(database);

        if (!authorisationServiceClient.isUserAuthorisedToManageUsers(authenticatedServiceUser.getJwt())) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(AuthorisationServiceClient.UNAUTHORISED_USER_MESSAGE).build();
        }

        database
                .deleteFrom((Table) USERS)
                .where(new Condition[]{USERS.ID.eq(userId)}).execute();

        Data tokenData = new Data();
        tokenData.setName(Integer.valueOf(userId).toString());
        ObjectOutcome objectOutcome = new ObjectOutcome();
        objectOutcome.getData().add(tokenData);
        stroomEventLoggingService.delete(
                httpServletRequest,
                authenticatedServiceUser.getName(),
                objectOutcome,
                "Delete a user by ID");

        Response response = Response.status(Response.Status.OK).build();
        return response;
    }

    private static Boolean doesUserAlreadyExist(DSLContext database, String email) {
        int countOfSameName = database
                .selectCount()
                .from(USERS)
                .where(new Condition[]{USERS.EMAIL.eq(email)})
                .fetchOne(0, Integer.TYPE);

        return countOfSameName > 0;
    }
}

