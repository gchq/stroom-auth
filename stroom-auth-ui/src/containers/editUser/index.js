import React, {Component} from 'react'

import UserEditUi from './UserEditUi';

class UserEditUi extends Component {
  constructor() {
    super()
    this.state = {
      rules: []
    }

  }

  async componentDidMount() {
    //TODO get user from API and put into store
    //TODO Load from store? How?
  }

  render() {
    return (
      <div style={styles.root}>
        
      </div>
    )
  }
}

UserEditUi.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default UserEditUi