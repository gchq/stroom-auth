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

package stroom.auth.daos;

import com.google.common.base.Strings;
import org.jooq.Condition;
import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record11;
import org.jooq.Result;
import org.jooq.SelectJoinStep;
import org.jooq.SelectSelectStep;
import org.jooq.SortField;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.TokenGenerator;
import stroom.auth.config.TokenConfig;
import stroom.auth.exceptions.BadRequestException;
import stroom.auth.exceptions.NoSuchUserException;
import stroom.auth.exceptions.UnsupportedFilterException;
import stroom.auth.resources.token.v1.SearchRequest;
import stroom.auth.resources.token.v1.SearchResponse;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.resources.user.v1.User;
import stroom.db.auth.tables.Users;

import javax.inject.Inject;
import javax.inject.Singleton;
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
public class TokenDao {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenDao.class);

    @Inject
    private Configuration jooqConfig;

    @Inject
    private TokenConfig tokenConfig;

    private DSLContext database = null;

    @Inject
    private void init() {
        database = DSL.using(this.jooqConfig);
    }

    public SearchResponse searchTokens(SearchRequest searchRequest) {
        // Create some vars to allow the rest of this method to be more succinct.
        int page = searchRequest.getPage();
        int limit = searchRequest.getLimit();
        String orderBy = searchRequest.getOrderBy();
        String orderDirection = searchRequest.getOrderDirection();
        Map<String, String> filters = searchRequest.getFilters();

        // We need these aliased tables because we're joining tokens to users twice.
        Users issueingUsers = USERS.as("issueingUsers");
        Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");
        Users updatingUsers = USERS.as("updatingUsers");

        Field userEmail = tokenOwnerUsers.EMAIL.as("user_email");
        // Special cases
        Optional<SortField> orderByField;
        if (orderBy != null && orderBy.equals("user_email")) {
            // Why is this a special case? Because the property on the target table is 'email' but the param is 'user_email'
            // 'user_email' is a clearer param
            if (orderDirection.equals("asc")) {
                orderByField = Optional.of(userEmail.asc());
            } else {
                orderByField = Optional.of(userEmail.desc());
            }
        } else {
            orderByField = TokenDao.getOrderBy(orderBy, orderDirection);
            if (!orderByField.isPresent()) {
                throw new BadRequestException("Invalid orderBy: " + orderBy);
            }
        }

        Optional<List<Condition>> conditions;
        conditions = getConditions(filters, issueingUsers, tokenOwnerUsers, updatingUsers);

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
        List<Token> tokens = results.into(Token.class);

        // Finally we need to get the number of tokens so we can calculate the total number of pages
        SelectSelectStep<Record1<Integer>> selectCount =
                database.selectCount();
        SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
                fromCount = TokenDao.getFrom(selectCount, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);
        int count = fromCount
                .where(conditions.get())
                .fetchOne(0, int.class);
        // We need to round up so we always have enough pages even if there's a remainder.
        int pages = (int) Math.ceil((double) count / limit);

        SearchResponse searchResponse = new SearchResponse();
        searchResponse.setTokens(tokens);
        searchResponse.setTotalPages(pages);
        return searchResponse;
    }

    public String createEmailResetToken(String emailAddress) throws NoSuchUserException {
        return createToken(
                Token.TokenType.EMAIL_RESET, "authenticationResource",
                emailAddress,
                true, "Created for password reset")
                .getToken();
    }

    public String createToken(String recipientUserEmail) throws NoSuchUserException {
        return createToken(
                Token.TokenType.USER,
                "authenticationResource",
                recipientUserEmail,
                true,
                "Created for username/password user")
                .getToken();
    }

    /**
     * Create a token for a specific user.
     */
    public Token createToken(
            Token.TokenType tokenType,
            String issuingUserEmail,
            String recipientUserEmail,
            boolean isEnabled,
            String comment) throws NoSuchUserException {

        Record1<Integer> userRecord = database
                .select(USERS.ID)
                .from(USERS)
                .where(USERS.EMAIL.eq(recipientUserEmail))
                .fetchOne();
        if (userRecord == null) {
            throw new NoSuchUserException("Cannot find user to associate with this token!");
        }
        int recipientUserId = userRecord.get(USERS.ID);

        TokenGenerator tokenGenerator = new TokenGenerator(tokenType, recipientUserEmail, tokenConfig);
        tokenGenerator.createToken();

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

        Token tokenRecord = database
                .insertInto((Table) TOKENS)
                .set(TOKENS.USER_ID, recipientUserId)
                .set(TOKENS.TOKEN_TYPE_ID, tokenTypeId)
                .set(TOKENS.TOKEN, tokenGenerator.getToken())
                .set(TOKENS.EXPIRES_ON, tokenGenerator.getExpiresOn())
                .set(TOKENS.ISSUED_ON, Instant.now())
                .set(TOKENS.ISSUED_BY_USER, issuingUserId)
                .set(TOKENS.ENABLED, isEnabled)
                .set(TOKENS.COMMENTS, comment)
                .returning(new Field[]{TOKENS.ID})
                .fetchOne()
                .into(Token.class);

        return tokenRecord;
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

    public Optional<Token> readById(int tokenId) {

        // We need these aliased tables because we're joining tokens to users twice.
        Users issueingUsers = USERS.as("issueingUsers");
        Users tokenOwnerUsers = USERS.as("tokenOwnerUsers");
        Users updatingUsers = USERS.as("updatingUsers");

        Field userEmail = tokenOwnerUsers.EMAIL.as("user_email");
        SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>> selectFrom =
                getSelectFrom(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

        Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer> token =
                selectFrom
                        .where(new Condition[]{TOKENS.ID.eq(tokenId)})
                        .fetchOne();
        if (token == null) {
            return Optional.empty();
        }

        return Optional.of(token.into(Token.class));
    }


    public Optional<Token> readByToken(String token) {

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

        List<Token> tokenResult = result.into(Token.class);

        if (tokenResult.isEmpty()) {
            return Optional.empty();
        }

        LOGGER.info("Number of results: " + tokenResult.size());
        return Optional.of(tokenResult.get(0));
    }


    public static SelectJoinStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
    getSelectFrom(DSLContext database, Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail) {
        SelectSelectStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
                select = getSelect(database, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);

        SelectJoinStep from = getFrom(select, issueingUsers, tokenOwnerUsers, updatingUsers, userEmail);
        return from;
    }

    public static SelectSelectStep<Record11<Integer, Boolean, Timestamp, String, Timestamp, String, String, String, String, Timestamp, Integer>>
    getSelect(DSLContext database, Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail) {
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
                updatingUsers.EMAIL.as("updated_by_user"),
                TOKENS.UPDATED_ON.as("updated_on"),
                TOKENS.USER_ID.as("user_id"));

        return select;
    }

    public static SelectJoinStep
    getFrom(SelectSelectStep select,
            Users issueingUsers, Users tokenOwnerUsers, Users updatingUsers, Field userEmail) {
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
        if (orderBy != null) {
            // We have an orderBy...
            if (TOKENS.field(orderBy) != null) {
                //... and this orderBy is from TOKENS...
                if (Strings.isNullOrEmpty(orderDirection)) {
                    // ... but we don't have an orderDirection
                    orderByField = TOKENS.field(orderBy).asc();
                } else {
                    // ... and we do have an order direction
                    orderByField = orderDirection.toLowerCase().equals("asc") ? TOKENS.field(orderBy).asc() : TOKENS.field(orderBy).desc();
                }
            } else if (USERS.field(orderBy) != null) {
                //... and this orderBy is from USERS
                if (Strings.isNullOrEmpty(orderDirection)) {
                    //... but we don't have an orderDirection
                    orderByField = USERS.field(orderBy).asc();
                } else {
                    // ... and we do have an order direction
                    orderByField = orderDirection.toLowerCase().equals("asc") ? USERS.field(orderBy).asc() : USERS.field(orderBy).desc();
                }
            } else if (TOKEN_TYPES.field(orderBy) != null) {
                //... and this orderBy is from TOKEN_TYPES
                if (Strings.isNullOrEmpty(orderDirection)) {
                    //... but we don't have an orderDirection
                    orderByField = TOKEN_TYPES.field(orderBy).asc();
                } else {
                    // ... and we do have an order direction
                    orderByField = orderDirection.toLowerCase().equals("asc") ? TOKEN_TYPES.field(orderBy).asc() : TOKEN_TYPES.field(orderBy).desc();
                }
            } else {
                // ... but we couldn't match it to anything
                return Optional.empty();
            }
        } else {
            // We don't have an orderBy so we'll use the default ordering
            orderByField = TOKENS.ISSUED_ON.desc();
        }
        return Optional.of(orderByField);
    }

    public void enableOrDisableToken(int tokenId, boolean enabled, User updatingUser) {
        Object result = database
                .update(TOKENS)
                .set(TOKENS.ENABLED, enabled)
                .set(TOKENS.UPDATED_ON, Timestamp.from(Instant.now()))
                .set(TOKENS.UPDATED_BY_USER, updatingUser.getId())
                .where(TOKENS.ID.eq((tokenId)))
                .execute();
    }

    /**
     * How do we match on dates? Must match exactly? Must match part of the date? What if the given date is invalid?
     * Is this what a user would want? Maybe they want greater than or less than? This would need additional UI
     * For now we can't sensible implement anything unless we have a better idea of requirements.
     */
    private static Optional<List<Condition>> getConditions(Map<String, String> filters, Users issueingUsers,
                                                           Users tokenOwnerUsers, Users updatingUsers) {
        // We need to set up conditions
        List<Condition> conditions = new ArrayList<>();
        final String unsupportedFilterMessage = "Unsupported filter: ";
        final String unknownFilterMessage = "Unknown filter: ";
        if (filters != null) {
            for (String key : filters.keySet()) {
                Condition condition = null;
                //TODO make this consts to avoid String creation costs
                switch (key) {
                    case "enabled":
                        condition = TOKENS.ENABLED.eq(Boolean.valueOf(filters.get(key)));
                        break;
                    case "expires_on":
                        throw new UnsupportedFilterException(unsupportedFilterMessage + key);
                    case "user_email":
                        condition = tokenOwnerUsers.EMAIL.contains(filters.get(key));
                        break;
                    case "issued_on":
                        throw new UnsupportedFilterException(unsupportedFilterMessage + key);
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
                        throw new UnsupportedFilterException(unsupportedFilterMessage + key);
                    case "user_id":
                        throw new UnsupportedFilterException(unsupportedFilterMessage + key);
                    default:
                        throw new UnsupportedFilterException(unknownFilterMessage + key);
                }

                conditions.add(condition);
            }
        }
        return Optional.of(conditions);
    }
}
