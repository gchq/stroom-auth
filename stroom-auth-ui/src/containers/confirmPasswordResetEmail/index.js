import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Card from 'material-ui/Card'

import './ConfirmPasswordResetEmail.css'
import '../Layout.css'

class ConfirmPasswordResetEmail extends Component {
  render() {
    return (
        <div className='content-floating-without-appbar'>
          <Card className="ConfirmPasswordResetEmail-card">
              <h3>Password reset email has been sent.</h3>
              <p>Please check your email. You should receive a message with a link that will let you change your password. This link will be valid for five minutes.</p>
          </Card>
        </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPasswordResetEmail)