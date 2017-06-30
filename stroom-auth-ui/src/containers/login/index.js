import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes, {object} from 'prop-types'

import Card, { CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import './Login.css'
import { required, email } from '../../validations'
import { onSubmit } from '../../modules/login'

const LoginForm = props => {
  const {handleSubmit, pristine, submitting } = props
    return (
      <Card className='Login-card'>
        <form onSubmit={handleSubmit}>
          <p>Please log in</p>
          <br/>
          <Field 
            className="User-loginForm"
            name="email"
            component={TextField}
            hintText="Email"
            validate={[required]}
            warn={email}
          />

          <Field 
            className="User-loginForm"
            name="password"
            component={TextField}
            hintText="Password"
            validate={[required]}
          />

          <CardActions>
            <FlatButton 
              color="primary" className="User-button" 
              disabled={pristine || submitting}
              type="submit">
                Log in
            </FlatButton>
          </CardActions>
        </form>
      </Card>
    )
  }

const ReduxLoginForm = reduxForm({
  form: 'LoginForm'
})(LoginForm)

LoginForm.contextTypes = {
  router: PropTypes.shape({
    history: object.isRequired,
  }),
}

LoginForm.propTypes ={
  token: PropTypes.string.isRequired,
  errorStatus: PropTypes.number,
  errorText: PropTypes.string,
  showLoader: PropTypes.bool
}

const mapStateToProps = state => ({
  token: state.login.token,
  errorStatus: state.login.errorStatus,
  errorText: state.login.errorText,
  showLoader: state.login.showLoader
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxLoginForm)