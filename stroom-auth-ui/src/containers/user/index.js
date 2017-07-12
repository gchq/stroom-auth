import React from 'react'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'

// It'd be much better to use MUI inputs but there's currently a bug that makes our use-case unsuitable.
import { Input } from 'react-materialize'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {attemptCreate} from '../../modules/user'

import './User.css'

class User extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <Card >
        <form>

          <CardContent>
            <Typography type="headline" component="h2">
              Please enter the details of the new user
            </Typography>
            <Input label="Username" className='User-loginForm'
              value={this.state.username} 
              onChange={ (e) => this.setState({username: e.target.value})}/>

            <Input type="password" label="Password" 
              value={this.state.password} 
              onChange={ (e) => this.setState({password: e.target.value})}/>
          </CardContent>

          <CardActions>
            <Divider/>
            <Button color="primary" className="User-button" 
              onClick={ () => this.props.attemptCreate(this.state.username, this.state.password, this.props.token)} onSubmit={ () => this.props.attemptCreate}>
                Create user
            </Button>
            {this.props.showCreateLoader ? (<CircularProgress/>) : (<div/>)}
            {this.props.errorText !== '' ? (
                <div color='error'><p> {this.props.errorText}</p></div>
            ) : (
              <div/>
            )}
            <p>TODO: Include creation confirmation here?</p>
          </CardActions>

        </form>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  token: state.login.token,
  showCreateLoader: state.user.showCreateLoader,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  attemptCreate,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)