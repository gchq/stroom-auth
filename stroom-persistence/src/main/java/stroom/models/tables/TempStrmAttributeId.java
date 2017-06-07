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


import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.impl.TableImpl;

import stroom.models.Stroom;
import stroom.models.tables.records.TempStrmAttributeIdRecord;


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
public class TempStrmAttributeId extends TableImpl<TempStrmAttributeIdRecord> {

    private static final long serialVersionUID = -196505245;

    /**
     * The reference instance of <code>stroom.TEMP_STRM_ATTRIBUTE_ID</code>
     */
    public static final TempStrmAttributeId TEMP_STRM_ATTRIBUTE_ID = new TempStrmAttributeId();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<TempStrmAttributeIdRecord> getRecordType() {
        return TempStrmAttributeIdRecord.class;
    }

    /**
     * The column <code>stroom.TEMP_STRM_ATTRIBUTE_ID.ID</code>.
     */
    public final TableField<TempStrmAttributeIdRecord, Long> ID = createField("ID", org.jooq.impl.SQLDataType.BIGINT.nullable(false), this, "");

    /**
     * Create a <code>stroom.TEMP_STRM_ATTRIBUTE_ID</code> table reference
     */
    public TempStrmAttributeId() {
        this("TEMP_STRM_ATTRIBUTE_ID", null);
    }

    /**
     * Create an aliased <code>stroom.TEMP_STRM_ATTRIBUTE_ID</code> table reference
     */
    public TempStrmAttributeId(String alias) {
        this(alias, TEMP_STRM_ATTRIBUTE_ID);
    }

    private TempStrmAttributeId(String alias, Table<TempStrmAttributeIdRecord> aliased) {
        this(alias, aliased, null);
    }

    private TempStrmAttributeId(String alias, Table<TempStrmAttributeIdRecord> aliased, Field<?>[] parameters) {
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
    public TempStrmAttributeId as(String alias) {
        return new TempStrmAttributeId(alias, this);
    }

    /**
     * Rename this table
     */
    @Override
    public TempStrmAttributeId rename(String name) {
        return new TempStrmAttributeId(name, null);
    }
}
