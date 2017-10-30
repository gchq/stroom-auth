/*
 * This file is generated by jOOQ.
*/
package stroom.db.auth.tables.records;


import java.sql.Timestamp;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record11;
import org.jooq.Row11;
import org.jooq.impl.UpdatableRecordImpl;

import stroom.db.auth.tables.Tokens;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.9.3"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class TokensRecord extends UpdatableRecordImpl<TokensRecord> implements Record11<Integer, Integer, Integer, String, Timestamp, Timestamp, Integer, Boolean, Timestamp, Integer, String> {

    private static final long serialVersionUID = 889349118;

    /**
     * Setter for <code>auth.tokens.id</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>auth.tokens.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>auth.tokens.user_id</code>.
     */
    public void setUserId(Integer value) {
        set(1, value);
    }

    /**
     * Getter for <code>auth.tokens.user_id</code>.
     */
    public Integer getUserId() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>auth.tokens.token_type_id</code>.
     */
    public void setTokenTypeId(Integer value) {
        set(2, value);
    }

    /**
     * Getter for <code>auth.tokens.token_type_id</code>.
     */
    public Integer getTokenTypeId() {
        return (Integer) get(2);
    }

    /**
     * Setter for <code>auth.tokens.token</code>.
     */
    public void setToken(String value) {
        set(3, value);
    }

    /**
     * Getter for <code>auth.tokens.token</code>.
     */
    public String getToken() {
        return (String) get(3);
    }

    /**
     * Setter for <code>auth.tokens.expires_on</code>.
     */
    public void setExpiresOn(Timestamp value) {
        set(4, value);
    }

    /**
     * Getter for <code>auth.tokens.expires_on</code>.
     */
    public Timestamp getExpiresOn() {
        return (Timestamp) get(4);
    }

    /**
     * Setter for <code>auth.tokens.issued_on</code>.
     */
    public void setIssuedOn(Timestamp value) {
        set(5, value);
    }

    /**
     * Getter for <code>auth.tokens.issued_on</code>.
     */
    public Timestamp getIssuedOn() {
        return (Timestamp) get(5);
    }

    /**
     * Setter for <code>auth.tokens.issued_by_user</code>.
     */
    public void setIssuedByUser(Integer value) {
        set(6, value);
    }

    /**
     * Getter for <code>auth.tokens.issued_by_user</code>.
     */
    public Integer getIssuedByUser() {
        return (Integer) get(6);
    }

    /**
     * Setter for <code>auth.tokens.enabled</code>.
     */
    public void setEnabled(Boolean value) {
        set(7, value);
    }

    /**
     * Getter for <code>auth.tokens.enabled</code>.
     */
    public Boolean getEnabled() {
        return (Boolean) get(7);
    }

    /**
     * Setter for <code>auth.tokens.updated_on</code>.
     */
    public void setUpdatedOn(Timestamp value) {
        set(8, value);
    }

    /**
     * Getter for <code>auth.tokens.updated_on</code>.
     */
    public Timestamp getUpdatedOn() {
        return (Timestamp) get(8);
    }

    /**
     * Setter for <code>auth.tokens.updated_by_user</code>.
     */
    public void setUpdatedByUser(Integer value) {
        set(9, value);
    }

    /**
     * Getter for <code>auth.tokens.updated_by_user</code>.
     */
    public Integer getUpdatedByUser() {
        return (Integer) get(9);
    }

    /**
     * Setter for <code>auth.tokens.comments</code>.
     */
    public void setComments(String value) {
        set(10, value);
    }

    /**
     * Getter for <code>auth.tokens.comments</code>.
     */
    public String getComments() {
        return (String) get(10);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record11 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row11<Integer, Integer, Integer, String, Timestamp, Timestamp, Integer, Boolean, Timestamp, Integer, String> fieldsRow() {
        return (Row11) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row11<Integer, Integer, Integer, String, Timestamp, Timestamp, Integer, Boolean, Timestamp, Integer, String> valuesRow() {
        return (Row11) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field1() {
        return Tokens.TOKENS.ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field2() {
        return Tokens.TOKENS.USER_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field3() {
        return Tokens.TOKENS.TOKEN_TYPE_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field4() {
        return Tokens.TOKENS.TOKEN;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Timestamp> field5() {
        return Tokens.TOKENS.EXPIRES_ON;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Timestamp> field6() {
        return Tokens.TOKENS.ISSUED_ON;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field7() {
        return Tokens.TOKENS.ISSUED_BY_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Boolean> field8() {
        return Tokens.TOKENS.ENABLED;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Timestamp> field9() {
        return Tokens.TOKENS.UPDATED_ON;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field10() {
        return Tokens.TOKENS.UPDATED_BY_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field11() {
        return Tokens.TOKENS.COMMENTS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value1() {
        return getId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value2() {
        return getUserId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value3() {
        return getTokenTypeId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value4() {
        return getToken();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Timestamp value5() {
        return getExpiresOn();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Timestamp value6() {
        return getIssuedOn();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value7() {
        return getIssuedByUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Boolean value8() {
        return getEnabled();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Timestamp value9() {
        return getUpdatedOn();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value10() {
        return getUpdatedByUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value11() {
        return getComments();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value1(Integer value) {
        setId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value2(Integer value) {
        setUserId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value3(Integer value) {
        setTokenTypeId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value4(String value) {
        setToken(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value5(Timestamp value) {
        setExpiresOn(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value6(Timestamp value) {
        setIssuedOn(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value7(Integer value) {
        setIssuedByUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value8(Boolean value) {
        setEnabled(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value9(Timestamp value) {
        setUpdatedOn(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value10(Integer value) {
        setUpdatedByUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord value11(String value) {
        setComments(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TokensRecord values(Integer value1, Integer value2, Integer value3, String value4, Timestamp value5, Timestamp value6, Integer value7, Boolean value8, Timestamp value9, Integer value10, String value11) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        value7(value7);
        value8(value8);
        value9(value9);
        value10(value10);
        value11(value11);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached TokensRecord
     */
    public TokensRecord() {
        super(Tokens.TOKENS);
    }

    /**
     * Create a detached, initialised TokensRecord
     */
    public TokensRecord(Integer id, Integer userId, Integer tokenTypeId, String token, Timestamp expiresOn, Timestamp issuedOn, Integer issuedByUser, Boolean enabled, Timestamp updatedOn, Integer updatedByUser, String comments) {
        super(Tokens.TOKENS);

        set(0, id);
        set(1, userId);
        set(2, tokenTypeId);
        set(3, token);
        set(4, expiresOn);
        set(5, issuedOn);
        set(6, issuedByUser);
        set(7, enabled);
        set(8, updatedOn);
        set(9, updatedByUser);
        set(10, comments);
    }
}
