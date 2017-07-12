import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes, {object} from 'prop-types'
import queryString from 'query-string'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import { Input } from 'react-materialize'
import Grid from 'material-ui/Grid'

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
      username: '',
      password: '',
      referrer
    }
  }

  login(username, password) {
    this.props.attempLogin(this.state.username, this.state.password, this.state.referrer)
  }

  render() {
    const isLoggedIn = this.props.token !== ''
 
    return (
      <Grid container>
        <Grid item xs={4}/>
        <Grid item xs={4}>
          <Card className='Login-card'>
            { isLoggedIn ? (
                <Card title='You are already logged in. Why not try going somewhere else?' />
              ) : (
            <form>

              <CardContent>
                <Typography type="headline" component="h2">
                  Please log in
                </Typography>
                <br/>
                <Input label="Username" className='User-loginForm'
                  value={this.state.username} 
                  onChange={ (e) => this.setState({username: e.target.value})}/>

                <Input type="password" label="Password" 
                  value={this.state.password} 
                  onChange={ (e) => this.setState({password: e.target.value})}/>

              </CardContent>

              <CardActions>
                <Button color="primary" className="User-button" 
                  onClick={ () => this.login(this.props.username, this.props.password)} 
                  onSubmit={ () => this.login(this.props.username, this.props.password)}>
                    Log in
                </Button>
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
        </Grid>
        <Grid item xs={4}/>
      </Grid>
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