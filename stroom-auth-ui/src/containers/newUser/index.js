import React, { Component } from 'react'
import { Redirect } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { relativePath } from '../../relativePush'

class NewUser extends Component {
  render() {
    return ( <Redirect to={relativePath("/user")}/>)
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewUser)