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

import {attemptCreate, loadUser, saveChanges} from '../../modules/user'

import './User.css'

class User extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidUpdate(){
    console.log("CDU")
  }

  render(props) {
    var isEditing = false
    if(this.props && this.props.userId){
      isEditing = true
      this.state.email = ''
      this.state.password = ''
      //TODO: dispatch to get the user
      //TODO: clear state
    }
   
    return (
      <Card >
        <form>

          <CardContent>
            {isEditing ? (
              <Typography type="headline" component="h2">
                Update the user's details below
              </Typography>
            ) : (
              <Typography type="headline" component="h2">
                Please enter the details of the new user
              </Typography>
            )}

            <br/>
            <Input label="Email" className='User-loginForm'
              value={this.state.email} 
              onChange={ (e) => this.setState({email: e.target.value})}/>

            <Input type="password" label="Password" 
              value={this.state.password} 
              onChange={ (e) => this.setState({password: e.target.value})}/>
          </CardContent>

          <CardActions>
            <Divider/>
            {isEditing ? (
              <Button color="primary" className="User-button" 
                onClick={ () => this.props.saveChanges(this.state.email, this.state.password, this.props.token)} onSubmit={ () => this.props.attemptCreate}>
                  Save changes to user
              </Button>
            ) : (
              <Button color="primary" className="User-button" 
                onClick={ () => this.props.attemptCreate(this.state.email, this.state.password, this.props.token)} onSubmit={ () => this.props.attemptCreate}>
                  Create user
              </Button>
            )}
            {this.props.showCreateLoader ? (<CircularProgress/>) : (<div/>)}
            {this.props.errorText !== '' ? (
                <div color='error'><p> {this.props.errorText}</p></div>
            ) : (
              <div/>
            )}
          </CardActions>
        </form>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  token: state.login.token,
  showCreateLoader: state.user.showCreateLoader,
  email: state.user.email,
  password: state.user.password,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  attemptCreate,
  saveChanges
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)