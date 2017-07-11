import React, { Component } from 'react'
import { Redirect } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {logout} from '../../modules/login'

class Logout extends Component {
  componentDidMount(){
    this.props.logout()
  }

  render() {
    return ( <Redirect to="/"/>)
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)