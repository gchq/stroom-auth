/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/*
 * This file is generated by jOOQ.
*/
package stroom.models.tables.records;


import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record5;
import org.jooq.Row5;
import org.jooq.impl.TableRecordImpl;

import stroom.models.tables.SqlStatValSrc;


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
public class SqlStatValSrcRecord extends TableRecordImpl<SqlStatValSrcRecord> implements Record5<Long, String, Byte, Long, Boolean> {

    private static final long serialVersionUID = -270515313;

    /**
     * Setter for <code>stroom.SQL_STAT_VAL_SRC.TIME_MS</code>.
     */
    public void setTimeMs(Long value) {
        set(0, value);
    }

    /**
     * Getter for <code>stroom.SQL_STAT_VAL_SRC.TIME_MS</code>.
     */
    public Long getTimeMs() {
        return (Long) get(0);
    }

    /**
     * Setter for <code>stroom.SQL_STAT_VAL_SRC.NAME</code>.
     */
    public void setName(String value) {
        set(1, value);
    }

    /**
     * Getter for <code>stroom.SQL_STAT_VAL_SRC.NAME</code>.
     */
    public String getName() {
        return (String) get(1);
    }

    /**
     * Setter for <code>stroom.SQL_STAT_VAL_SRC.VAL_TP</code>.
     */
    public void setValTp(Byte value) {
        set(2, value);
    }

    /**
     * Getter for <code>stroom.SQL_STAT_VAL_SRC.VAL_TP</code>.
     */
    public Byte getValTp() {
        return (Byte) get(2);
    }

    /**
     * Setter for <code>stroom.SQL_STAT_VAL_SRC.VAL</code>.
     */
    public void setVal(Long value) {
        set(3, value);
    }

    /**
     * Getter for <code>stroom.SQL_STAT_VAL_SRC.VAL</code>.
     */
    public Long getVal() {
        return (Long) get(3);
    }

    /**
     * Setter for <code>stroom.SQL_STAT_VAL_SRC.PROCESSING</code>.
     */
    public void setProcessing(Boolean value) {
        set(4, value);
    }

    /**
     * Getter for <code>stroom.SQL_STAT_VAL_SRC.PROCESSING</code>.
     */
    public Boolean getProcessing() {
        return (Boolean) get(4);
    }

    // -------------------------------------------------------------------------
    // Record5 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row5<Long, String, Byte, Long, Boolean> fieldsRow() {
        return (Row5) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row5<Long, String, Byte, Long, Boolean> valuesRow() {
        return (Row5) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field1() {
        return SqlStatValSrc.SQL_STAT_VAL_SRC.TIME_MS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field2() {
        return SqlStatValSrc.SQL_STAT_VAL_SRC.NAME;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Byte> field3() {
        return SqlStatValSrc.SQL_STAT_VAL_SRC.VAL_TP;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field4() {
        return SqlStatValSrc.SQL_STAT_VAL_SRC.VAL;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Boolean> field5() {
        return SqlStatValSrc.SQL_STAT_VAL_SRC.PROCESSING;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value1() {
        return getTimeMs();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value2() {
        return getName();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Byte value3() {
        return getValTp();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value4() {
        return getVal();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Boolean value5() {
        return getProcessing();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord value1(Long value) {
        setTimeMs(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord value2(String value) {
        setName(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord value3(Byte value) {
        setValTp(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord value4(Long value) {
        setVal(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord value5(Boolean value) {
        setProcessing(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SqlStatValSrcRecord values(Long value1, String value2, Byte value3, Long value4, Boolean value5) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached SqlStatValSrcRecord
     */
    public SqlStatValSrcRecord() {
        super(SqlStatValSrc.SQL_STAT_VAL_SRC);
    }

    /**
     * Create a detached, initialised SqlStatValSrcRecord
     */
    public SqlStatValSrcRecord(Long timeMs, String name, Byte valTp, Long val, Boolean processing) {
        super(SqlStatValSrc.SQL_STAT_VAL_SRC);

        set(0, timeMs);
        set(1, name);
        set(2, valTp);
        set(3, val);
        set(4, processing);
    }
}
