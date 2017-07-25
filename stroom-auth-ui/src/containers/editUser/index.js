import React, {Component} from 'react'
import PropTypes from 'prop-types'

import UserEditUi from './UserEditUi'
import { fetchUser } from '../../modules/user'

class UserEditForm extends Component {
  constructor() {
    super()
    this.state = {
      rules: []
    }

  }

  async componentDidMount() {
    const userId = this.props.userId
    this.context.store.dispatch(fetchUser(userId))

    //TODO get user from API and put into store
    //TODO Load from store? How?
  }

  render() {
    return (
      <UserEditUi/>
    )
  }
}

UserEditForm.contextTypes = {
  store: PropTypes.object.isRequired
}

export default UserEditForm