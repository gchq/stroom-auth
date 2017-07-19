import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
// import Typography from 'material-ui/Typography'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
// import Grid from 'material-ui/Grid'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu'

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

  render(props) {
    var isEditing = false
    if(this.props && this.props.userId){
      isEditing = true
      this.state.email = ''
      this.state.password = ''
      this.state.comments = ''
      this.state.first_name = ''
      this.state.last_name = ''
      this.state.state = 0
      //TODO: dispatch to get the user
      //TODO: clear state
    }

// const renderInput = ({
//   input,
//   label,
//   meta: { touched, error },
//   ...custom
// }) =>
//   <TextField
//     placeholder={label}
//     {...input}
//     {...custom}
//   />

  const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) =>
  <TextField
    placeholder={label}
    {...input}
    {...custom}
  />

    // const emailInput = () => 
    //       <Input placeholder="Email" className='User-loginForm'
    //     value={this.state.email} />

    return (
      <Card >
        <form>

          <CardContent>
            {isEditing ? (
                <h2>Update the user's details below</h2>
            ) : (
                <p>Please enter the details of the new user</p>
            )}

            <br/>
                <Field name="email" component={renderTextField} label="Email"/>

              <TextField placeholder="First name" className='User-loginForm'
                value={this.state.first_name} 
                onChange={ (e) => this.setState({first_name: e.target.value})}/>

                <TextField placeholder="Last name" className='User-loginForm'
                  value={this.state.last_name} 
                  onChange={ (e) => this.setState({last_name: e.target.value})}/>

                <TextField placeholder="Password" label="Password" className='User-loginForm'
                  value={this.state.password} 
                  onChange={ (e) => this.setState({password: e.target.value})}/>

                <TextField placeholder="Comments" className='User-loginForm'
                  value={this.state.comments} 
                  onChange={ (e) => this.setState({comments: e.target.value})}/>

                <UserStateMenu 
                  value={this.state.state}
                  onChange={ (state) => {
                    this.setState({state: state})
                    console.log("STATE: " + state) 
                  }}/>
          </CardContent>

          <CardActions>
            <Divider/>
            {isEditing ? (
              <FlatButton color="primary" className="User-button" 
                onClick={() => this.props.saveChanges(this.state.email, this.state.password, this.props.token)} 
                onSubmit={() => this.props.attemptCreate}>
                  Save changes to user
              </FlatButton>
            ) : (
              <FlatButton color="primary" className="User-button" 
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
              </FlatButton>
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

export default reduxForm({
  form: 'createUser'
})(User)

// const mapStateToProps = state => ({
//   token: state.login.token,
//   showCreateLoader: state.user.showCreateLoader,
//   email: state.user.email,
//   password: state.user.password,
//   errorStatus: state.user.errorStatus,
//   errorText: state.user.errorText,
// })

// const mapDispatchToProps = dispatch => bindActionCreators({
//   attemptCreate,
//   saveChanges
// }, dispatch)

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(User)