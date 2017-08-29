import React, { Component } from 'react'
import { Redirect } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {logout} from '../../modules/login'
import { relativePath } from '../../relativePush'

class Logout extends Component {
  componentDidMount(){
    this.props.logout()
  }

  render() {
    return ( <Redirect to={relativePath("/")}/>)
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