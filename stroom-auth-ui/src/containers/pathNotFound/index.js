import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Card, { CardContent } from 'material-ui/Card'

import './PathNotFound.css'

class PathNotFound extends Component {
  render() {
    return (
      <Card className="PathNotFound-card">
          <h3>Page not found!</h3>
          <p>There's nothing here I'm afraid.</p>
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
)(PathNotFound)