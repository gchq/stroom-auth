import React, {Component} from 'react'
import PropTypes from 'prop-types'

import TokenLayout from './TokenLayout'
import { changeVisibleContainer } from '../../modules/token'

//TODO:
// export class UserCreate extends Component {
//     componentWillMount() {
//     // We're going to store what we're displaying in the state. We could also detect what to display from the route.
//     this.context.store.dispatch(changeVisibleContainer('create'))
//   }
//
//     render() {
//     return (
//         <UserLayout/>
//     )
//   }
// }
//
// UserCreate.contextTypes = {
//   store: PropTypes.object.isRequired
// }
//

export class TokenSearch extends Component {
    componentWillMount() {
    // We're going to store what we're displaying in the state. We could also detect what to display from the route.
    this.context.store.dispatch(changeVisibleContainer('search'))
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