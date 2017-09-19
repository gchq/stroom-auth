package stroom.auth.service.resources.token.v1;

import com.google.common.base.Strings;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.Condition;
import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.JSONFormat;
import org.jooq.Record1;
import org.jooq.Record11;
import org.jooq.Result;
import org.jooq.SelectJoinStep;
import org.jooq.SelectSelectStep;
import org.jooq.SortField;
import org.jooq.Table;
import org.jooq.impl.DSL;
import stroom.auth.service.TokenGenerator;
import stroom.auth.service.config.TokenConfig;
import stroom.db.auth.tables.Users;
import stroom.db.auth.tables.records.TokensRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import static stroom.db.auth.Tables.TOKENS;
import static stroom.db.auth.Tables.TOKEN_TYPES;
import static stroom.db.auth.Tables.USERS;

@Singleton
public class TokenDao {

  @Inject
  private Configuration jooqConfig;

  @Inject
  private TokenConfig tokenConfig;

  private DSLContext database = null;

  @Inject
  private void init() {
    database = DSL.using(this.jooqConfig);
  }

  /**
   * Create a token for a specific user.
   */
  public String createToken(
      Token.TokenType tokenType,
      String issuingUserEmail,
      String recipientUserEmail) throws TokenCreationException {

    Record1<Integer> userRecord = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(recipientUserEmail))
        .fetchOne();
    if(userRecord == null){
      throw new TokenCreationException("Cannot find user to associate with this token!");
    }
    int recipientUserId = userRecord.get(USERS.ID);

    TokenGenerator tokenGenerator = new TokenGenerator(tokenType, recipientUserEmail, tokenConfig);

    int issuingUserId = database
        .select(USERS.ID)
        .from(USERS)
        .where(USERS.EMAIL.eq(issuingUserEmail))
        .fetchOne()
        .get(USERS.ID);

    int tokenTypeId = database
        .select(TOKEN_TYPES.ID)
        .from(TOKEN_TYPES)
        .where(TOKEN_TYPES.TOKEN_TYPE.eq(tokenType.getText().toLowerCase()))
        .fetchOne()
        .get(TOKEN_TYPES.ID);

    TokensRecord tokenRecord = (TokensRecord) database
        .insertInto((Table) TOKENS)
        .set(TOKENS.USER_ID, recipientUserId)
        .set(TOKENS.TOKEN_TYPE_ID, tokenTypeId)
        .set(TOKENS.TOKEN, tokenGenerator.getToken())
        .set(TOKENS.EXPIRES_ON, tokenGenerator.getExpiresOn())
        .set(TOKENS.ISSUED_ON, Instant.now() )
        .set(TOKENS.ISSUED_BY_USER, issuingUserId)
        .set(TOKENS.ENABLED, true)
        .returning(new Field[]{TOKENS.ID}).fetchOne();

    return tokenGenerator.getToken();
  }

  public void deleteAllTokens() {
    database.deleteFrom(TOKENS).execute();
  }

  public void deleteTokenById(int tokenId) {
    database.deleteFrom(TOKENS).where(TOKENS.ID.eq(tokenId)).execute();
  }

  public void deleteTokenByTokenString(String token) {
    database.deleteFrom(TOKENS).where(TOKENS.TOKEN.eq(token)).execute();
  }

  public Optional<ImmutablePair<String, String>>
  readById(int tokenId) {

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
      return Optional.empty();
    }
    String tokenUser = (String)result.get(0).get("user_email");

    String serialisedResults = result.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));
    return Optional.of(new ImmutablePair<>(tokenUser, serialisedResults));
  }

  public Optional<ImmutablePair<String, String>>
  readByToken(String token) {

    // We need these aliased tables because we're joining tokens to users twice.
    Users issueingUsers = USERS.as("issueingUsers");
    Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");
    Users updatingUsers = USERS.as("updatingUsers");

    Field userEmail = tokenOwnerUsers.EMAIL.as("user_email");
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> selectFrom =
        TokenDao.getSelectFrom(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

    Result<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        result = selectFrom
        .where(new Condition[]{TOKENS.TOKEN.eq(token)})
        .fetch();

    if(result.isEmpty()){
      return Optional.empty();
    }
    String tokenUser = (String)result.get(0).get("user_email");

    String serialisedResults = result.formatJSON((new JSONFormat()).header(false).recordFormat(JSONFormat.RecordFormat.OBJECT));
    return Optional.of(new ImmutablePair<>(tokenUser, serialisedResults));
  }



  public static SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
  getSelectFrom(DSLContext database, Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail){
    SelectSelectStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        select = getSelect(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

    SelectJoinStep from = getFrom(select, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);
    return from;
  }

  public static SelectSelectStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
  getSelect(DSLContext database, Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail){
    SelectSelectStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        select = database.select(
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
        TOKENS.USER_ID.as("user_id"));

    return select;
  }

  public static SelectJoinStep
  getFrom(SelectSelectStep select,
          Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail){
    SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
        from = select.from(TOKENS
        .join(TOKEN_TYPES)
        .on(TOKENS.TOKEN_TYPE_ID.eq(TOKEN_TYPES.ID))
        .join(issueingUsers)
        .on(TOKENS.ISSUED_BY_USER.eq(issueingUsers.ID))
        .join(tokenOwnerUsers)
        .on(TOKENS.USER_ID.eq(tokenOwnerUsers.ID))
        .join(updatingUsers)
        .on(TOKENS.ISSUED_BY_USER.eq(updatingUsers.ID)));

    return from;
  }


  public static Optional<SortField> getOrderBy(String orderBy, String orderDirection) {
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
}
