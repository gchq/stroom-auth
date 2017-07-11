import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class LogOutAndInNavLink extends Component {

  render() {
    const isLoggedIn = this.props.token !== ''
 
    return (
      <div>
        {isLoggedIn ? (
          <NavLink to="logout">Log out</NavLink>
        ) : (
          <NavLink to="login">Log in</NavLink>
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