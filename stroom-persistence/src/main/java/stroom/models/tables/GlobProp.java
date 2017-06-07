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
import org.jooq.Identity;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.TableImpl;

import stroom.models.Keys;
import stroom.models.Stroom;
import stroom.models.tables.records.GlobPropRecord;


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
public class GlobProp extends TableImpl<GlobPropRecord> {

    private static final long serialVersionUID = -1117821911;

    /**
     * The reference instance of <code>stroom.GLOB_PROP</code>
     */
    public static final GlobProp GLOB_PROP = new GlobProp();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<GlobPropRecord> getRecordType() {
        return GlobPropRecord.class;
    }

    /**
     * The column <code>stroom.GLOB_PROP.ID</code>.
     */
    public final TableField<GlobPropRecord, Integer> ID = createField("ID", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>stroom.GLOB_PROP.VER</code>.
     */
    public final TableField<GlobPropRecord, Byte> VER = createField("VER", org.jooq.impl.SQLDataType.TINYINT.nullable(false), this, "");

    /**
     * The column <code>stroom.GLOB_PROP.CRT_MS</code>.
     */
    public final TableField<GlobPropRecord, Long> CRT_MS = createField("CRT_MS", org.jooq.impl.SQLDataType.BIGINT, this, "");

    /**
     * The column <code>stroom.GLOB_PROP.CRT_USER</code>.
     */
    public final TableField<GlobPropRecord, String> CRT_USER = createField("CRT_USER", org.jooq.impl.SQLDataType.VARCHAR.length(255), this, "");

    /**
     * The column <code>stroom.GLOB_PROP.UPD_MS</code>.
     */
    public final TableField<GlobPropRecord, Long> UPD_MS = createField("UPD_MS", org.jooq.impl.SQLDataType.BIGINT, this, "");

    /**
     * The column <code>stroom.GLOB_PROP.UPD_USER</code>.
     */
    public final TableField<GlobPropRecord, String> UPD_USER = createField("UPD_USER", org.jooq.impl.SQLDataType.VARCHAR.length(255), this, "");

    /**
     * The column <code>stroom.GLOB_PROP.NAME</code>.
     */
    public final TableField<GlobPropRecord, String> NAME = createField("NAME", org.jooq.impl.SQLDataType.VARCHAR.length(255).nullable(false), this, "");

    /**
     * The column <code>stroom.GLOB_PROP.VAL</code>.
     */
    public final TableField<GlobPropRecord, String> VAL = createField("VAL", org.jooq.impl.SQLDataType.CLOB.nullable(false), this, "");

    /**
     * Create a <code>stroom.GLOB_PROP</code> table reference
     */
    public GlobProp() {
        this("GLOB_PROP", null);
    }

    /**
     * Create an aliased <code>stroom.GLOB_PROP</code> table reference
     */
    public GlobProp(String alias) {
        this(alias, GLOB_PROP);
    }

    private GlobProp(String alias, Table<GlobPropRecord> aliased) {
        this(alias, aliased, null);
    }

    private GlobProp(String alias, Table<GlobPropRecord> aliased, Field<?>[] parameters) {
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
    public Identity<GlobPropRecord, Integer> getIdentity() {
        return Keys.IDENTITY_GLOB_PROP;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<GlobPropRecord> getPrimaryKey() {
        return Keys.KEY_GLOB_PROP_PRIMARY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<GlobPropRecord>> getKeys() {
        return Arrays.<UniqueKey<GlobPropRecord>>asList(Keys.KEY_GLOB_PROP_PRIMARY, Keys.KEY_GLOB_PROP_NAME);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public GlobProp as(String alias) {
        return new GlobProp(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public GlobProp rename(String name) {
        return new GlobProp(name, null);
    }
}
