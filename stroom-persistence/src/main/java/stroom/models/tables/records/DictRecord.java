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
import org.jooq.Record10;
import org.jooq.Row10;
import org.jooq.impl.UpdatableRecordImpl;

import stroom.models.tables.Dict;


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
public class DictRecord extends UpdatableRecordImpl<DictRecord> implements Record10<Integer, Byte, Long, String, Long, String, String, String, String, Integer> {

    private static final long serialVersionUID = 529728525;

    /**
     * Setter for <code>stroom.DICT.ID</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>stroom.DICT.ID</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>stroom.DICT.VER</code>.
     */
    public void setVer(Byte value) {
        set(1, value);
    }

    /**
     * Getter for <code>stroom.DICT.VER</code>.
     */
    public Byte getVer() {
        return (Byte) get(1);
    }

    /**
     * Setter for <code>stroom.DICT.CRT_MS</code>.
     */
    public void setCrtMs(Long value) {
        set(2, value);
    }

    /**
     * Getter for <code>stroom.DICT.CRT_MS</code>.
     */
    public Long getCrtMs() {
        return (Long) get(2);
    }

    /**
     * Setter for <code>stroom.DICT.CRT_USER</code>.
     */
    public void setCrtUser(String value) {
        set(3, value);
    }

    /**
     * Getter for <code>stroom.DICT.CRT_USER</code>.
     */
    public String getCrtUser() {
        return (String) get(3);
    }

    /**
     * Setter for <code>stroom.DICT.UPD_MS</code>.
     */
    public void setUpdMs(Long value) {
        set(4, value);
    }

    /**
     * Getter for <code>stroom.DICT.UPD_MS</code>.
     */
    public Long getUpdMs() {
        return (Long) get(4);
    }

    /**
     * Setter for <code>stroom.DICT.UPD_USER</code>.
     */
    public void setUpdUser(String value) {
        set(5, value);
    }

    /**
     * Getter for <code>stroom.DICT.UPD_USER</code>.
     */
    public String getUpdUser() {
        return (String) get(5);
    }

    /**
     * Setter for <code>stroom.DICT.NAME</code>.
     */
    public void setName(String value) {
        set(6, value);
    }

    /**
     * Getter for <code>stroom.DICT.NAME</code>.
     */
    public String getName() {
        return (String) get(6);
    }

    /**
     * Setter for <code>stroom.DICT.UUID</code>.
     */
    public void setUuid(String value) {
        set(7, value);
    }

    /**
     * Getter for <code>stroom.DICT.UUID</code>.
     */
    public String getUuid() {
        return (String) get(7);
    }

    /**
     * Setter for <code>stroom.DICT.DAT</code>.
     */
    public void setDat(String value) {
        set(8, value);
    }

    /**
     * Getter for <code>stroom.DICT.DAT</code>.
     */
    public String getDat() {
        return (String) get(8);
    }

    /**
     * Setter for <code>stroom.DICT.FK_FOLDER_ID</code>.
     */
    public void setFkFolderId(Integer value) {
        set(9, value);
    }

    /**
     * Getter for <code>stroom.DICT.FK_FOLDER_ID</code>.
     */
    public Integer getFkFolderId() {
        return (Integer) get(9);
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
    // Record10 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row10<Integer, Byte, Long, String, Long, String, String, String, String, Integer> fieldsRow() {
        return (Row10) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row10<Integer, Byte, Long, String, Long, String, String, String, String, Integer> valuesRow() {
        return (Row10) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field1() {
        return Dict.DICT.ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Byte> field2() {
        return Dict.DICT.VER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field3() {
        return Dict.DICT.CRT_MS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field4() {
        return Dict.DICT.CRT_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field5() {
        return Dict.DICT.UPD_MS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field6() {
        return Dict.DICT.UPD_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field7() {
        return Dict.DICT.NAME;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field8() {
        return Dict.DICT.UUID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field9() {
        return Dict.DICT.DAT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field10() {
        return Dict.DICT.FK_FOLDER_ID;
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
    public Byte value2() {
        return getVer();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value3() {
        return getCrtMs();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value4() {
        return getCrtUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value5() {
        return getUpdMs();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value6() {
        return getUpdUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value7() {
        return getName();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value8() {
        return getUuid();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value9() {
        return getDat();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value10() {
        return getFkFolderId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value1(Integer value) {
        setId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value2(Byte value) {
        setVer(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value3(Long value) {
        setCrtMs(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value4(String value) {
        setCrtUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value5(Long value) {
        setUpdMs(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value6(String value) {
        setUpdUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value7(String value) {
        setName(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value8(String value) {
        setUuid(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value9(String value) {
        setDat(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord value10(Integer value) {
        setFkFolderId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public DictRecord values(Integer value1, Byte value2, Long value3, String value4, Long value5, String value6, String value7, String value8, String value9, Integer value10) {
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
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached DictRecord
     */
    public DictRecord() {
        super(Dict.DICT);
    }

    /**
     * Create a detached, initialised DictRecord
     */
    public DictRecord(Integer id, Byte ver, Long crtMs, String crtUser, Long updMs, String updUser, String name, String uuid, String dat, Integer fkFolderId) {
        super(Dict.DICT);

        set(0, id);
        set(1, ver);
        set(2, crtMs);
        set(3, crtUser);
        set(4, updMs);
        set(5, updUser);
        set(6, name);
        set(7, uuid);
        set(8, dat);
        set(9, fkFolderId);
    }
}
