import React, { Component } from 'react'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class PathNotFound extends Component {

  render() {
    return (
      <Card >
          <CardContent>
            <Typography type="headline" component="h3">
              Page not found!
            </Typography>
            <Typography type="body1">
              There's nothing here I'm afraid.
            </Typography>
          </CardContent>
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