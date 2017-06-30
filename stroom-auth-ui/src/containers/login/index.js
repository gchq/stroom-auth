import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes, {object} from 'prop-types'
import { Field, reduxForm } from 'redux-form'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

import CircularProgress from 'material-ui/CircularProgress'
import { TextField } from 'redux-form-material-ui'

import { required, email } from '../../validations'
import {attempLogin} from '../../modules/login'
import { onSubmit } from '../../modules/login'

import './Login.css'

// class Login extends Component {
const LoginForm = props => {

  // constructor(props, context) {
  //   super(props, context)
  //   // Try and get the referrer, or if there isn't one use '/'. E.g. one might use the following to set the referrer.
  //   // <Redirect to={{
  //   //    pathname: '/login',
  //   //    state: {referrer:'/user'}}}/>
  //   const referrer = this.context.router.history.location.state !== undefined ? this.context.router.history.location.state.referrer : ''

  //   this.state = {
  //     email: '',
  //     password: '',
  //     referrer
  //   }
  // }

  // login(email, password) {
  //   this.props.attempLogin(this.state.email, this.state.password, this.state.referrer)
  // }
  const {handleSubmit, pristine, submitting } = props

    return (
          <Card className='Login-card'>
            <form onSubmit={handleSubmit}>

                  <p>
                  Please log in</p>
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
                {/*<TextField label="Email" className='User-loginForm'
                  value={this.state.email} 
                  onChange={ (e) => this.setState({email: e.target.value})}/>

                <TextField type="password" label="Password" 
                  value={this.state.password} 
                  onChange={ (e) => this.setState({password: e.target.value})}/>*/}


              <CardActions>
                <FlatButton 
                  color="primary" className="User-button" 
                  disabled={pristine || submitting}
                  type="submit">
                    Log in
                </FlatButton>

                {/*<FlatButton color="primary" className="User-button" 
                  onClick={ () => this.login(this.props.email, this.props.password)} 
                  onSubmit={ () => this.login(this.props.email, this.props.password)}>
                    Log in
                </FlatButton>
                {this.props.showCreateLoader ? (<CircularProgress/>) : (<div/>)}
                {this.props.errorText !== '' ? (
                    <div color='error'><p> {this.props.errorText}</p></div>
                ) : (
                  <div/>
                )}*/}
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
  attempLogin,
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxLoginForm)