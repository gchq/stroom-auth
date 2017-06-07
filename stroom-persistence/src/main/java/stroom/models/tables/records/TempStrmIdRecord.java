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
import org.jooq.Record1;
import org.jooq.Row1;
import org.jooq.impl.TableRecordImpl;

import stroom.models.tables.TempStrmId;


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
public class TempStrmIdRecord extends TableRecordImpl<TempStrmIdRecord> implements Record1<Long> {

    private static final long serialVersionUID = 942241463;

    /**
     * Setter for <code>stroom.TEMP_STRM_ID.ID</code>.
     */
    public void setId(Long value) {
        set(0, value);
    }

    /**
     * Getter for <code>stroom.TEMP_STRM_ID.ID</code>.
     */
    public Long getId() {
        return (Long) get(0);
    }

    // -------------------------------------------------------------------------
    // Record1 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row1<Long> fieldsRow() {
        return (Row1) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row1<Long> valuesRow() {
        return (Row1) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field1() {
        return TempStrmId.TEMP_STRM_ID.ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value1() {
        return getId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TempStrmIdRecord value1(Long value) {
        setId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TempStrmIdRecord values(Long value1) {
        value1(value1);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached TempStrmIdRecord
     */
    public TempStrmIdRecord() {
        super(TempStrmId.TEMP_STRM_ID);
    }

    /**
     * Create a detached, initialised TempStrmIdRecord
     */
    public TempStrmIdRecord(Long id) {
        super(TempStrmId.TEMP_STRM_ID);

        set(0, id);
    }
}
