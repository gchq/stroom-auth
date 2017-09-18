import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'

// import AutoComplete from 'material-ui/AutoComplete'
import { AutoComplete } from 'redux-form-material-ui'
import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import './CreateTokenForm.css'
import '../Layout.css'
import { createToken as onSubmit, userAutoCompleteChange } from '../../modules/token'

export class TokenCreateForm extends Component {

  render() {
    const {handleSubmit, pristine, submitting } = this.props
    return (
        <div className=''>
          <Card className="CreateTokenForm-card">
            <div>
              <form onSubmit={handleSubmit}>
                <div className="left-container">
                  <div className="field-container">
                    <div className="label-container">
                      <label>Email</label>
                    </div>
                    <div className="input-container">
                      <Field
                          hintText="Type a user's email address to create them a token"
                          component={AutoComplete}
                          openOnFocus
                          dataSource={this.props.matchingAutoCompleteResults}
                          onChange={(_, autoCompleteText) => this.props.userAutoCompleteChange(autoCompleteText, this.props.token)}
                      />
                    </div>
                  </div>
                </div>
                <br/>
                <div>
                  <RaisedButton
                      primary={true}
                      disabled={pristine || submitting}
                      type="submit"
                      label="Issue API token"/>
                </div>
              </form>
            </div>
          </Card>
        </div>
    )
  }
}

const ReduxTokenCreateForm = reduxForm({
  form: 'TokenCreateForm'
})(TokenCreateForm)

const mapStateToProps = state => ({
  token: state.login.token,
  // showCreateLoader: state.user.showCreateLoader,
  // errorStatus: state.user.errorStatus,
  // errorText: state.user.errorText,
  matchingAutoCompleteResults: state.token.matchingAutoCompleteResults
})

const mapDispatchToProps = dispatch => bindActionCreators({
  userAutoCompleteChange,
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTokenCreateForm)