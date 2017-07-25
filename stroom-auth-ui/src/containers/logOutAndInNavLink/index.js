import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import FlatButton from 'material-ui/FlatButton'
import ExitToApp from 'material-ui-icons/ExitToApp'
import {fullWhite} from 'material-ui/styles/colors'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class LogOutAndInNavLink extends Component {

  render() {
    const isLoggedIn = this.props.token !== ''
 
    return (
      <div>
        {isLoggedIn ? (

          <NavLink to="logout">
            <FlatButton label="Log out" labelStyle={{color:'white'}} icon={<ExitToApp color={fullWhite}/>}/>
          </NavLink>
        ) : (
          <NavLink to="login">
            <FlatButton label="Log in" labelStyle={{color:'white'}}/>
          </NavLink>
        )}
      </div>
    )
  }
}

LogOutAndInNavLink.propTypes ={
  token: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    token: state.login.token
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogOutAndInNavLink)