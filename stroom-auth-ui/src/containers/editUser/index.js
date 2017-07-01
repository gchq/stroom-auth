import React, {Component} from 'react'
import PropTypes, {object} from 'prop-types'

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
    const userId = this.context.router.route.match.params.userId
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
  store: PropTypes.object.isRequired,
  router: PropTypes.shape({
    history: object.isRequired,
  }),
}

export default UserEditForm