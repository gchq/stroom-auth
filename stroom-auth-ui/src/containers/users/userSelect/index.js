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

import React from 'react';
import {connect} from 'react-redux';
import {compose, withState} from 'recompose';
import AsyncSelect from 'react-select/lib/Async';

import './asyncUserSelect.css';

const loadOptions = (inputValue, callback, idToken, url) => {
  const email = inputValue || '';
  fetch(`${url}/search?email=${email}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    method: 'get',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(body => {
      const options = body.map(result => {
        return {value: result.id, label: result.email};
      });
      callback(options);
    });
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
  }),
  placeholder: (provided, state) => ({
    fontSize: 14,
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: 14,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: 14,
  }),
};

const enhance = compose(
  connect(
    ({authentication: {idToken}, config: {userServiceUrl}}) => ({
      idToken,
      userServiceUrl,
    }),
    {},
  ),
  withState('inputValue', 'setInputValue', ''),
);

function AsyncUserSelect(props) {
  const {onChange, inputValue, setInputValue, idToken, userServiceUrl} = props;

  return (
    <AsyncSelect
      placeholder=""
      styles={customStyles}
      className="AsyncUserSelect"
      cacheOptions
      defaultOptions
      loadOptions={(inputValue, callback) =>
        loadOptions(inputValue, callback, idToken, userServiceUrl)
      }
      onInputChange={value => {
        setInputValue(value);
        return value;
      }}
      onChange={value => onChange('user', value)}
    />
  );
}

export default enhance(AsyncUserSelect);
