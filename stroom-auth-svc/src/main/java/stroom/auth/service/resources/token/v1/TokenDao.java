package stroom.auth.service.resources.token.v1;

import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Table;
import org.jooq.impl.DSL;
import stroom.auth.service.TokenGenerator;
import stroom.auth.service.config.TokenConfig;
import stroom.db.auth.tables.records.TokensRecord;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.Instant;

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
}
