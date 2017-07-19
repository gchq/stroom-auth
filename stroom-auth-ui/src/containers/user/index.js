import React from 'react'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Input from 'material-ui/Input/Input'
import Grid from 'material-ui/Grid'
import { LabelSwitch } from 'material-ui/Switch'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import UserStateMenu from '../userStateMenu'
import {attemptCreate, loadUser, saveChanges} from '../../modules/user'

import './User.css'

class User extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      comments: '',
      first_name: '',
      last_name: '',
      state: 0
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
      this.state.comments = ''
      this.state.first_name = ''
      this.state.last_name = ''
      this.state.state = 1
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
            <Grid container>
              <Grid item xs={12}>
                <Input placeholder="Email" className='User-loginForm'
                  value={this.state.email} 
                  onChange={ (e) => this.setState({email: e.target.value})}/>
              </Grid>

              <Grid item xs={12}>
              <Input placeholder="First name" className='User-loginForm'
                value={this.state.first_name} 
                onChange={ (e) => this.setState({first_name: e.target.value})}/>
              </Grid>

              <Grid item xs={12}>
                <Input placeholder="Last name" className='User-loginForm'
                  value={this.state.last_name} 
                  onChange={ (e) => this.setState({last_name: e.target.value})}/>
              </Grid>

              <Grid item xs={12}>
                <Input placeholder="Password" label="Password" 
                  value={this.state.password} 
                  onChange={ (e) => this.setState({password: e.target.value})}/>
              </Grid>

              <Grid item xs={12}>
                <Input placeholder="Comments" 
                  value={this.state.comments} 
                  onChange={ (e) => this.setState({comments: e.target.value})}/>
              </Grid>

              <Grid item xs={12}>
                <UserStateMenu 
                  value={this.state.state}
                  onChange={ (state) => {
                    this.setState({state: state})
                    console.log("STATE: " + state) 
                  }}/>
              </Grid>
            </Grid>
          </CardContent>

          <CardActions>
            <Divider/>
            {isEditing ? (
              <Button color="primary" className="User-button" 
                onClick={() => this.props.saveChanges(this.state.email, this.state.password, this.props.token)} 
                onSubmit={() => this.props.attemptCreate}>
                  Save changes to user
              </Button>
            ) : (
              <Button color="primary" className="User-button" 
                onClick={() => this.props.attemptCreate(
                  this.state.email, 
                  this.state.password, 
                  this.state.first_name, 
                  this.state.last_name, 
                  this.state.comments,
                  this.state.state,
                  this.props.token)} 
                onSubmit={() => this.props.attemptCreate}>
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