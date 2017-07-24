package stroom.auth.service.resources;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Preconditions;
import io.dropwizard.auth.Auth;
import org.apache.commons.lang3.tuple.Pair;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Result;
import org.jooq.Table;
import org.jooq.TableField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.Config;
import stroom.auth.service.security.ServiceUser;
import stroom.db.auth.tables.records.UsersRecord;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.sql.Timestamp;
import java.time.Instant;

import static stroom.db.auth.Tables.USERS;

@Path("/user")
@Produces({"application/json"})
public final class UserResource {
  private final Config config;
  private final Logger logger;

  @GET
  @Path("/")
  @Timed
  @NotNull
  public final Response getAll(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database) {
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    TableField orderByEmailField = USERS.EMAIL;
    String usersAsJson = database
        .selectFrom(USERS)
        .orderBy(orderByEmailField)
        .fetch()
        .formatJSON((new JSONFormat())
            .header(false)
            .recordFormat(JSONFormat.RecordFormat.OBJECT));
    return Response.status(Response.Status.OK).entity(usersAsJson).build();
  }


  @POST
  @Path("/")
  @Timed
  @NotNull
  public final Response createUser(
      @Auth @NotNull ServiceUser authenticatedServiceUser,
      @Context @NotNull DSLContext database,
      @Nullable User user) {
    // Validate
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);
    Pair<Boolean, String> validationResults = User.isValidForCreate(user);
    boolean isUserValid = validationResults.getLeft();
    if(!isUserValid){
      return Response.status(Response.Status.BAD_REQUEST).entity(validationResults.getRight()).build();
    }

    if (doesUserAlreadyExist(database, user.getEmail())) {
      return Response.status(Response.Status.CONFLICT).entity(UserValidationError.USER_ALREADY_EXISTS).build();
    }

    // Create the user
    UsersRecord usersRecord = (UsersRecord) database
        .insertInto((Table) USERS)
        .set( USERS.EMAIL, user.getEmail())
        .set(USERS.PASSWORD_HASH, "TODO HASH")
        .set(USERS.FIRST_NAME, user.getFirst_name())
        .set(USERS.LAST_NAME, user.getLast_name())
        .set(USERS.COMMENTS, user.getComments())
        .set(USERS.STATE, user.getState())
        .set(USERS.CREATED_ON, Timestamp.from(Instant.now()))
        .set(USERS.CREATED_BY_USER, authenticatedServiceUser.getName())
        .returning(new Field[]{USERS.ID}).fetchOne();
    return Response.status(Response.Status.OK).entity(usersRecord.getId()).build();
  }

  @GET
  @Path("/me")
  @Timed
  @NotNull
  public final Response readCurrentUser(@Auth @NotNull ServiceUser authenticatedServiceUser, @Context @NotNull DSLContext database) {
    // Validate
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    // Get the user
    UsersRecord foundUserRecord = database
        .selectFrom(USERS)
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
    Response response = Response.status(Response.Status.OK).entity(foundUserJson).build();
    return response;
  }

  @GET
  @Path("{id}")
  @Timed
  @NotNull
  public final Response getUser(@Auth @NotNull ServiceUser authenticatedServiceUser, @Context @NotNull DSLContext database, @PathParam("id") int userId) {
    // Validate
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    // Get the user
    UsersRecord foundUserRecord = database
        .selectFrom(USERS)
        .where(new Condition[]{USERS.ID.eq(Integer.valueOf(userId))})
        .fetchOne();
    Response response;
    if (foundUserRecord == null) {
      response = Response.status(Response.Status.NOT_FOUND).build();
      return response;
    } else {
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
      String foundUserJson = foundUserResult.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));
      response = Response.status(Response.Status.OK).entity(foundUserJson).build();
      return response;
    }
  }

  @PUT
  @Path("{id}")
  @Timed
  @NotNull
  public final Response updateUser(@Auth @NotNull ServiceUser authenticatedServiceUser, @Context @NotNull DSLContext database, @NotNull User user, @PathParam("id") int userId) {
    // Validate
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);
    Preconditions.checkNotNull(user);

    UsersRecord usersRecord = (UsersRecord) database
        .selectFrom((Table) USERS)
        .where(new Condition[]{USERS.ID.eq(Integer.valueOf(userId))})
        .fetchOne();
    UsersRecord updatedUsersRecord = UserMapper.updateUserRecordWithUser(user, usersRecord);
    database.update((Table) USERS).set( updatedUsersRecord).where(new Condition[]{USERS.ID.eq(Integer.valueOf(userId))}).execute();
    Response response = Response.status(Response.Status.OK).build();
    return response;
  }

  @DELETE
  @Path("{id}")
  @Timed
  @NotNull
  public final Response deleteUser(@Auth @NotNull ServiceUser authenticatedServiceUser, @Context @NotNull DSLContext database, @PathParam("id") int userId) {
    // Validate
    Preconditions.checkNotNull(authenticatedServiceUser);
    Preconditions.checkNotNull(database);

    database.deleteFrom((Table) USERS).where(new Condition[]{USERS.ID.eq(Integer.valueOf(userId))}).execute();
    Response var10000 = Response.status(Response.Status.OK).build();
    return var10000;
  }

  public UserResource(@NotNull Config config) {
    super();
    Preconditions.checkNotNull(config);
    this.config = config;
    this.logger = LoggerFactory.getLogger(AuthenticationResource.class);
  }

  private static Boolean doesUserAlreadyExist(DSLContext database, String email){
    int countOfSameName = database
        .selectCount()
        .from(USERS)
        .where(new Condition[]{USERS.EMAIL.eq(email)})
        .fetchOne(0, Integer.TYPE);

    return countOfSameName > 0;
  }
}

