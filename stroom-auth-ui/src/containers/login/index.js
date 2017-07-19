import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes, {object} from 'prop-types'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

// import Typography from 'material-ui/Typography'
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField'
// import Grid from 'material-ui/Grid'


import {attempLogin} from '../../modules/login'

import './Login.css'

class Login extends Component {

  constructor(props, context) {
    super(props, context)
    // Try and get the referrer, or if there isn't one use '/'. E.g. one might use the following to set the referrer.
    // <Redirect to={{
    //    pathname: '/login',
    //    state: {referrer:'/user'}}}/>
    const referrer = this.context.router.history.location.state !== undefined ? this.context.router.history.location.state.referrer : ''

    this.state = {
      email: '',
      password: '',
      referrer
    }
  }

  login(email, password) {
    this.props.attempLogin(this.state.email, this.state.password, this.state.referrer)
  }

  render() {
    const isLoggedIn = this.props.token !== ''
 
    return (

          <Card className='Login-card'>
            { isLoggedIn ? (
                <Card title='You are already logged in. Why not try going somewhere else?' />
              ) : (
            <form>

                  <p>
                  Please log in</p>
                <br/>
                <TextField label="Email" className='User-loginForm'
                  value={this.state.email} 
                  onChange={ (e) => this.setState({email: e.target.value})}/>

                <TextField type="password" label="Password" 
                  value={this.state.password} 
                  onChange={ (e) => this.setState({password: e.target.value})}/>


              <CardActions>
                <FlatButton color="primary" className="User-button" 
                  onClick={ () => this.login(this.props.email, this.props.password)} 
                  onSubmit={ () => this.login(this.props.email, this.props.password)}>
                    Log in
                </FlatButton>
                {this.props.showCreateLoader ? (<CircularProgress/>) : (<div/>)}
                {this.props.errorText !== '' ? (
                    <div color='error'><p> {this.props.errorText}</p></div>
                ) : (
                  <div/>
                )}
              </CardActions>

            </form>
            )}
          </Card>

    )
  }
}

Login.contextTypes = {
  router: PropTypes.shape({
    history: object.isRequired,
  }),
}

Login.propTypes ={
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
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)