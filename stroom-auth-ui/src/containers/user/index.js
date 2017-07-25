import React, {Component} from 'react'
import PropTypes from 'prop-types'

import UserLayout from './UserLayout'
import { changeVisibleContainer } from '../../modules/user'

export class UserCreate extends Component {
    componentWillMount() {
    // We're going to store what we're displaying in the state. We could also detect what to display from the route.
    this.context.store.dispatch(changeVisibleContainer('create'))
  }

    render() {
    return (
      <div>
        <UserLayout/>
      </div>
    )
  }
}

UserCreate.contextTypes = {
  store: PropTypes.object.isRequired
}

export class UserEdit extends Component {
    componentWillMount() {
    // We're going to store what we're displaying in the state. We could also detect what to display from the route.
    this.context.store.dispatch(changeVisibleContainer('edit'))
  }

    render() {
    return (
      <div>
        <UserLayout/>
      </div>
    )
  }
}

UserEdit.contextTypes = {
  store: PropTypes.object.isRequired
}

export class UserSearch extends Component {
    componentWillMount() {
    // We're going to store what we're displaying in the state. We could also detect what to display from the route.
    this.context.store.dispatch(changeVisibleContainer('search'))
  }

    render() {
    return (
      <div>
        <UserLayout/>
      </div>
    )
  }
}

UserSearch.contextTypes = {
  store: PropTypes.object.isRequired
}