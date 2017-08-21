import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Card from 'material-ui/Card'

import './Unauthorised.css'

class Unauthorised extends Component {
  render() {
    return (
      <Card className="Unauthorised-card">
          <h3>Unauthorised!</h3>
          <p>I'm afraid you're not authorised to see this page. If you think you should be able to please contact an administrator.</p>
      </Card>
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
)(Unauthorised)