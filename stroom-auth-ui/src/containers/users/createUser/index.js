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

import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxForm } from "redux-form";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "redux-react-hook";
import { initialize } from "redux-form";

import "./CreateUserForm.css";
import "../../Layout.css";
import UserFields from "../userFields";
import { createUser as onSubmit } from "../../../modules/user";

function UserCreateForm(props) {
  const { handleSubmit, pristine, submitting, error } = props;

  // Use Hooks to dispatch initialize, so that 'Account status' defaults to 'Active'.
  const dispatch = useDispatch();
  const dispatchInitialize = useCallback(() =>
    dispatch(initialize("UserCreateForm", { state: "enabled" }), [])
  );
  // The second paramter, [], determines when this is re-run. [] means never,
  // which effectively makes this equivelent to componentDidMount.
  useEffect(() => dispatchInitialize(), []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="header">
          <button
            className="toolbar-button-small"
            disabled={pristine || submitting}
            type="submit"
          >
            <FontAwesomeIcon icon="save" /> Save
          </button>
          <NavLink to="/userSearch">
            <button className="toolbar-button-small">
              <FontAwesomeIcon icon="times" /> Cancel
            </button>
          </NavLink>
        </div>
        <UserFields
          showCalculatedFields={false}
          constrainPasswordEditing={false}
        />
        {error && <strong>{error}</strong>}
      </form>
    </div>
  );
}

const ReduxUserCreateForm = reduxForm({
  form: "UserCreateForm",
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(UserCreateForm);

const mapStateToProps = state => ({
  showCreateLoader: state.user.showCreateLoader,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSubmit
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserCreateForm);
