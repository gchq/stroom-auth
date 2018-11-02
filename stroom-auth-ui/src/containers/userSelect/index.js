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

import React, { Component, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/lib/Async";
import { useMappedState } from "redux-react-hook";

import './asyncUserSelect.css'

const loadOptions = (inputValue, callback, idToken, url) => {
  fetch(`${url}/search?email=${inputValue}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken
    },
    method: "get",
    mode: "cors"
  })
    .then(response => response.json())
    .then(body => {
      const options = body.map(result => {
        return { value: result.id, label: result.email };
      });
      callback(options);
    });
};

const mapState = state => ({
  idToken: state.authentication.idToken,
  url: state.config.userServiceUrl
});

function AsyncUserSelect(props) {
    const {onChange} = props;
  const [inputValue, setInputValue] = useState("");
  const { idToken, url } = useMappedState(mapState);

  return (
      <AsyncSelect
        id='selectedUser'
        className='AsyncUserSelect'
        cacheOptions
        loadOptions={(inputValue, callback) =>
          loadOptions(inputValue, callback, idToken, url)
        }
        defaultOptions
        onInputChange={setInputValue}
        onChange={(value) => onChange('user', value)}
      />
  );
}

export default AsyncUserSelect;
