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
import org.jooq.Record12;
import org.jooq.Row12;
import org.jooq.impl.UpdatableRecordImpl;

import stroom.models.tables.JbNd;


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
public class JbNdRecord extends UpdatableRecordImpl<JbNdRecord> implements Record12<Integer, Byte, String, String, Byte, Boolean, String, Integer, Integer, Integer, Long, Long> {

    private static final long serialVersionUID = 672601451;

    /**
     * Setter for <code>stroom.JB_ND.ID</code>.
     */
    public void setId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.ID</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>stroom.JB_ND.VER</code>.
     */
    public void setVer(Byte value) {
        set(1, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.VER</code>.
     */
    public Byte getVer() {
        return (Byte) get(1);
    }

    /**
     * Setter for <code>stroom.JB_ND.CRT_USER</code>.
     */
    public void setCrtUser(String value) {
        set(2, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.CRT_USER</code>.
     */
    public String getCrtUser() {
        return (String) get(2);
    }

    /**
     * Setter for <code>stroom.JB_ND.UPD_USER</code>.
     */
    public void setUpdUser(String value) {
        set(3, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.UPD_USER</code>.
     */
    public String getUpdUser() {
        return (String) get(3);
    }

    /**
     * Setter for <code>stroom.JB_ND.JB_TP</code>.
     */
    public void setJbTp(Byte value) {
        set(4, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.JB_TP</code>.
     */
    public Byte getJbTp() {
        return (Byte) get(4);
    }

    /**
     * Setter for <code>stroom.JB_ND.ENBL</code>.
     */
    public void setEnbl(Boolean value) {
        set(5, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.ENBL</code>.
     */
    public Boolean getEnbl() {
        return (Boolean) get(5);
    }

    /**
     * Setter for <code>stroom.JB_ND.SCHEDULE</code>.
     */
    public void setSchedule(String value) {
        set(6, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.SCHEDULE</code>.
     */
    public String getSchedule() {
        return (String) get(6);
    }

    /**
     * Setter for <code>stroom.JB_ND.TASK_LMT</code>.
     */
    public void setTaskLmt(Integer value) {
        set(7, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.TASK_LMT</code>.
     */
    public Integer getTaskLmt() {
        return (Integer) get(7);
    }

    /**
     * Setter for <code>stroom.JB_ND.FK_JB_ID</code>.
     */
    public void setFkJbId(Integer value) {
        set(8, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.FK_JB_ID</code>.
     */
    public Integer getFkJbId() {
        return (Integer) get(8);
    }

    /**
     * Setter for <code>stroom.JB_ND.FK_ND_ID</code>.
     */
    public void setFkNdId(Integer value) {
        set(9, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.FK_ND_ID</code>.
     */
    public Integer getFkNdId() {
        return (Integer) get(9);
    }

    /**
     * Setter for <code>stroom.JB_ND.CRT_MS</code>.
     */
    public void setCrtMs(Long value) {
        set(10, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.CRT_MS</code>.
     */
    public Long getCrtMs() {
        return (Long) get(10);
    }

    /**
     * Setter for <code>stroom.JB_ND.UPD_MS</code>.
     */
    public void setUpdMs(Long value) {
        set(11, value);
    }

    /**
     * Getter for <code>stroom.JB_ND.UPD_MS</code>.
     */
    public Long getUpdMs() {
        return (Long) get(11);
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
    // Record12 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row12<Integer, Byte, String, String, Byte, Boolean, String, Integer, Integer, Integer, Long, Long> fieldsRow() {
        return (Row12) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row12<Integer, Byte, String, String, Byte, Boolean, String, Integer, Integer, Integer, Long, Long> valuesRow() {
        return (Row12) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field1() {
        return JbNd.JB_ND.ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Byte> field2() {
        return JbNd.JB_ND.VER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field3() {
        return JbNd.JB_ND.CRT_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field4() {
        return JbNd.JB_ND.UPD_USER;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Byte> field5() {
        return JbNd.JB_ND.JB_TP;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Boolean> field6() {
        return JbNd.JB_ND.ENBL;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<String> field7() {
        return JbNd.JB_ND.SCHEDULE;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field8() {
        return JbNd.JB_ND.TASK_LMT;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field9() {
        return JbNd.JB_ND.FK_JB_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field10() {
        return JbNd.JB_ND.FK_ND_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field11() {
        return JbNd.JB_ND.CRT_MS;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Long> field12() {
        return JbNd.JB_ND.UPD_MS;
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
    public String value3() {
        return getCrtUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value4() {
        return getUpdUser();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Byte value5() {
        return getJbTp();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Boolean value6() {
        return getEnbl();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String value7() {
        return getSchedule();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value8() {
        return getTaskLmt();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value9() {
        return getFkJbId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value10() {
        return getFkNdId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value11() {
        return getCrtMs();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long value12() {
        return getUpdMs();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value1(Integer value) {
        setId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value2(Byte value) {
        setVer(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value3(String value) {
        setCrtUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value4(String value) {
        setUpdUser(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value5(Byte value) {
        setJbTp(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value6(Boolean value) {
        setEnbl(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value7(String value) {
        setSchedule(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value8(Integer value) {
        setTaskLmt(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value9(Integer value) {
        setFkJbId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value10(Integer value) {
        setFkNdId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value11(Long value) {
        setCrtMs(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord value12(Long value) {
        setUpdMs(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JbNdRecord values(Integer value1, Byte value2, String value3, String value4, Byte value5, Boolean value6, String value7, Integer value8, Integer value9, Integer value10, Long value11, Long value12) {
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
        value12(value12);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached JbNdRecord
     */
    public JbNdRecord() {
        super(JbNd.JB_ND);
    }

    /**
     * Create a detached, initialised JbNdRecord
     */
    public JbNdRecord(Integer id, Byte ver, String crtUser, String updUser, Byte jbTp, Boolean enbl, String schedule, Integer taskLmt, Integer fkJbId, Integer fkNdId, Long crtMs, Long updMs) {
        super(JbNd.JB_ND);

        set(0, id);
        set(1, ver);
        set(2, crtUser);
        set(3, updUser);
        set(4, jbTp);
        set(5, enbl);
        set(6, schedule);
        set(7, taskLmt);
        set(8, fkJbId);
        set(9, fkNdId);
        set(10, crtMs);
        set(11, updMs);
    }
}
