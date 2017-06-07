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
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.TableImpl;

import stroom.models.Keys;
import stroom.models.Stroom;
import stroom.models.tables.records.IdxVolRecord;


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
public class IdxVol extends TableImpl<IdxVolRecord> {

    private static final long serialVersionUID = 1803399783;

    /**
     * The reference instance of <code>stroom.IDX_VOL</code>
     */
    public static final IdxVol IDX_VOL = new IdxVol();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<IdxVolRecord> getRecordType() {
        return IdxVolRecord.class;
    }

    /**
     * The column <code>stroom.IDX_VOL.FK_IDX_ID</code>.
     */
    public final TableField<IdxVolRecord, Integer> FK_IDX_ID = createField("FK_IDX_ID", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>stroom.IDX_VOL.FK_VOL_ID</code>.
     */
    public final TableField<IdxVolRecord, Integer> FK_VOL_ID = createField("FK_VOL_ID", org.jooq.impl.SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * Create a <code>stroom.IDX_VOL</code> table reference
     */
    public IdxVol() {
        this("IDX_VOL", null);
    }

    /**
     * Create an aliased <code>stroom.IDX_VOL</code> table reference
     */
    public IdxVol(String alias) {
        this(alias, IDX_VOL);
    }

    private IdxVol(String alias, Table<IdxVolRecord> aliased) {
        this(alias, aliased, null);
    }

    private IdxVol(String alias, Table<IdxVolRecord> aliased, Field<?>[] parameters) {
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
    public UniqueKey<IdxVolRecord> getPrimaryKey() {
        return Keys.KEY_IDX_VOL_PRIMARY;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<UniqueKey<IdxVolRecord>> getKeys() {
        return Arrays.<UniqueKey<IdxVolRecord>>asList(Keys.KEY_IDX_VOL_PRIMARY);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ForeignKey<IdxVolRecord, ?>> getReferences() {
        return Arrays.<ForeignKey<IdxVolRecord, ?>>asList(Keys.VOL_FK_IDX_ID, Keys.IDX_FK_VOL_ID);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public IdxVol as(String alias) {
        return new IdxVol(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public IdxVol rename(String name) {
        return new IdxVol(name, null);
    }
}
