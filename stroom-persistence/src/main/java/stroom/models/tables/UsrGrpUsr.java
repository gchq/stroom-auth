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
import stroom.models.tables.records.UsrGrpUsrRecord;


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
public class UsrGrpUsr extends TableImpl<UsrGrpUsrRecord> {

    private static final long serialVersionUID = 1539341180;

    /**
     * The reference instance of <code>stroom.USR_GRP_USR</code>
     */
    public static final UsrGrpUsr USR_GRP_USR = new UsrGrpUsr();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<UsrGrpUsrRecord> getRecordType() {
        return UsrGrpUsrRecord.class;
    }

    /**
     * The column <code>stroom.USR_GRP_USR.ID</code>.
     */
    public final TableField<UsrGrpUsrRecord, Long> ID = createField("ID", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    /**
     * The column <code>stroom.USR_GRP_USR.VER</code>.
     */
    public final TableField<UsrGrpUsrRecord, Byte> VER = createField("VER", org.jooq.impl.SQLDataType.TINYINT.nullable(false), this, "");

    /**
     * The column <code>stroom.USR_GRP_USR.GRP_UUID</code>.
     */
    public final TableField<UsrGrpUsrRecord, String> GRP_UUID = createField("GRP_UUID", org.jooq.impl.SQLDataType.VARCHAR.length(255).nullable(false), this, "");

    /**
     * The column <code>stroom.USR_GRP_USR.USR_UUID</code>.
     */
    public final TableField<UsrGrpUsrRecord, String> USR_UUID = createField("USR_UUID", org.jooq.impl.SQLDataType.VARCHAR.length(255).nullable(false), this, "");

    /**
     * Create a <code>stroom.USR_GRP_USR</code> table reference
     */
    public UsrGrpUsr() {
        this("USR_GRP_USR", null);
    }

    /**
     * Create an aliased <code>stroom.USR_GRP_USR</code> table reference
     */
    public UsrGrpUsr(String alias) {
        this(alias, USR_GRP_USR);
    }

    private UsrGrpUsr(String alias, Table<UsrGrpUsrRecord> aliased) {
        this(alias, aliased, null);
    }

    private UsrGrpUsr(String alias, Table<UsrGrpUsrRecord> aliased, Field<?>[] parameters) {
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
    public Identity<UsrGrpUsrRecord, Long> getIdentity() {
        return Keys.IDENTITY_USR_GRP_USR;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UniqueKey<UsrGrpUsrRecord> getPrimaryKey() {
        return Keys.KEY_USR_GRP_USR_PRIMARY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<UsrGrpUsrRecord>> getKeys() {
        return Arrays.<UniqueKey<UsrGrpUsrRecord>>asList(Keys.KEY_USR_GRP_USR_PRIMARY, Keys.KEY_USR_GRP_USR_USR_GRP_USR_GRP_UUID_USR_UUID_IDX);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UsrGrpUsr as(String alias) {
        return new UsrGrpUsr(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public UsrGrpUsr rename(String name) {
        return new UsrGrpUsr(name, null);
    }
}
