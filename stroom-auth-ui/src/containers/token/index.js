import React, {Component} from 'react'
import PropTypes from 'prop-types'

import TokenLayout from './TokenLayout'
import { changeVisibleContainer } from '../../modules/token'

export class TokenSearch extends Component {
    componentWillMount() {
    // We're going to store what we're displaying in the state. We could also detect what to display from the route.
    this.context.store.dispatch(changeVisibleContainer('tokenSearch'))
  }

  render() {
    return (
        <TokenLayout/>
    )
  }
}

TokenSearch.contextTypes = {
  store: PropTypes.object.isRequired
}