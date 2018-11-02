/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import Checkbox from 'rc-checkbox'

export const renderField = ({
        disabled,
        input,
        label,
        type,
        meta: { touched, error, warning }
      }) => (
        <div className='field-container'>
          <label>{label}</label>
          <div>
          {type === 'textarea' ? (
              <textarea disabled={disabled} {...input} rows='3'/>)
              :(
            <input disabled={disabled} {...input} type={type} />)}
            {touched &&
              ((error && <span className='field-container__error'>{error}</span>) ||
                (warning && <span className='field-container__warning'>{warning}</span>))}
          </div>
        </div>
      );

export const renderCheckbox = ({
    disabled,
    input,
    label,
    meta: { touched, error, warning }
}) => {
    const checkedState = input.value ? 1 : 0
    return (
    <div className='field-container'>
    <label>{label}</label>
    <div>
    <Checkbox defaultChecked={checkedState} checked={checkedState} disabled={disabled} {...input} />
    {touched &&
              ((error && <span className='field-container__error'>{error}</span>) ||
                (warning && <span className='field-container__warning'>{warning}</span>))}
   </div>
    </div>
)};
