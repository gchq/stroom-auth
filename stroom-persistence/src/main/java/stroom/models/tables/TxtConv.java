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
package stroom.models.tables;


import java.util.Arrays;
import java.util.List;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.TableImpl;

import stroom.models.Keys;
import stroom.models.Stroom;
import stroom.models.tables.records.TxtConvRecord;


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
public class TxtConv extends TableImpl<TxtConvRecord> {

    private static final long serialVersionUID = 223992084;

    /**
     * The reference instance of <code>stroom.TXT_CONV</code>
     */
    public static final TxtConv TXT_CONV = new TxtConv();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<TxtConvRecord> getRecordType() {
        return TxtConvRecord.class;
    }

    /**
     * The column <code>stroom.TXT_CONV.ID</code>.
     */
    public final TableField<TxtConvRecord, Integer> ID = createField("ID", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>stroom.TXT_CONV.VER</code>.
     */
    public final TableField<TxtConvRecord, Byte> VER = createField("VER", org.jooq.impl.SQLDataType.TINYINT.nullable(false), this, "");

    /**
     * The column <code>stroom.TXT_CONV.CRT_MS</code>.
     */
    public final TableField<TxtConvRecord, Long> CRT_MS = createField("CRT_MS", org.jooq.impl.SQLDataType.BIGINT, this, "");

    /**
     * The column <code>stroom.TXT_CONV.CRT_USER</code>.
     */
    public final TableField<TxtConvRecord, String> CRT_USER = createField("CRT_USER", org.jooq.impl.SQLDataType.VARCHAR.length(255), this, "");

    /**
     * The column <code>stroom.TXT_CONV.UPD_MS</code>.
     */
    public final TableField<TxtConvRecord, Long> UPD_MS = createField("UPD_MS", org.jooq.impl.SQLDataType.BIGINT, this, "");

    /**
     * The column <code>stroom.TXT_CONV.UPD_USER</code>.
     */
    public final TableField<TxtConvRecord, String> UPD_USER = createField("UPD_USER", org.jooq.impl.SQLDataType.VARCHAR.length(255), this, "");

    /**
     * The column <code>stroom.TXT_CONV.NAME</code>.
     */
    public final TableField<TxtConvRecord, String> NAME = createField("NAME", org.jooq.impl.SQLDataType.VARCHAR.length(255).nullable(false), this, "");

    /**
     * The column <code>stroom.TXT_CONV.UUID</code>.
     */
    public final TableField<TxtConvRecord, String> UUID = createField("UUID", org.jooq.impl.SQLDataType.VARCHAR.length(255).nullable(false), this, "");

    /**
     * The column <code>stroom.TXT_CONV.DESCRIP</code>.
     */
    public final TableField<TxtConvRecord, String> DESCRIP = createField("DESCRIP", org.jooq.impl.SQLDataType.CLOB, this, "");

    /**
     * The column <code>stroom.TXT_CONV.CONV_TP</code>.
     */
    public final TableField<TxtConvRecord, Byte> CONV_TP = createField("CONV_TP", org.jooq.impl.SQLDataType.TINYINT.nullable(false), this, "");

    /**
     * The column <code>stroom.TXT_CONV.DAT</code>.
     */
    public final TableField<TxtConvRecord, String> DAT = createField("DAT", org.jooq.impl.SQLDataType.CLOB, this, "");

    /**
     * The column <code>stroom.TXT_CONV.FK_FOLDER_ID</code>.
     */
    public final TableField<TxtConvRecord, Integer> FK_FOLDER_ID = createField("FK_FOLDER_ID", org.jooq.impl.SQLDataType.INTEGER, this, "");

    /**
     * Create a <code>stroom.TXT_CONV</code> table reference
     */
    public TxtConv() {
        this("TXT_CONV", null);
    }

    /**
     * Create an aliased <code>stroom.TXT_CONV</code> table reference
     */
    public TxtConv(String alias) {
        this(alias, TXT_CONV);
    }

    private TxtConv(String alias, Table<TxtConvRecord> aliased) {
        this(alias, aliased, null);
    }

    private TxtConv(String alias, Table<TxtConvRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, "");
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Schema getSchema() {
        return Stroom.STROOM;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Identity<TxtConvRecord, Integer> getIdentity() {
        return Keys.IDENTITY_TXT_CONV;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<TxtConvRecord> getPrimaryKey() {
        return Keys.KEY_TXT_CONV_PRIMARY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<TxtConvRecord>> getKeys() {
        return Arrays.<UniqueKey<TxtConvRecord>>asList(Keys.KEY_TXT_CONV_PRIMARY, Keys.KEY_TXT_CONV_NAME, Keys.KEY_TXT_CONV_UUID);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ForeignKey<TxtConvRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<TxtConvRecord, ?>>asList(Keys.TXT_CONV_FK_FOLDER_ID);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TxtConv as(String alias) {
        return new TxtConv(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public TxtConv rename(String name) {
        return new TxtConv(name, null);
    }
}
