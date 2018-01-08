/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Card from 'material-ui/Card'
import Person from 'material-ui-icons/Person'
import VpnKey from 'material-ui-icons/VpnKey'
import {amber900 as secondaryColor} from 'material-ui/styles/colors'

import './Home.css'
import '../Layout.css'
import icon from '../../icon.png'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stroomLinkShadow: 1,
      usersLinkShadow: 1,
      tokensLinkShadow: 1
    }
  }

  render () {
    return (
      <div className='content-floating-with-appbar vertical'>
        <NavLink to={'/'}>
          <Card className='Home-card'
            onClick={() => window.location.href = `${this.props.stroomUiUrl}/?token=${this.props.idToken}`}
            onMouseOver={() => this.setState({stroomLinkShadow: 3})}
            onMouseOut={() => this.setState({stroomLinkShadow: 1})}
            zDepth={this.state.stroomLinkShadow}>
            <div className='Home-iconContainer'>
              <Avatar
                className='Home-icon'
                src={icon}
                size={100}
              />
            </div>
            <div className='Home-iconContainer'>
              <p>Go to Stroom</p>
            </div>
          </Card>
        </NavLink>
        <br />
        {this.props.canManageUsers ? (
          <NavLink to={'/userSearch'}>
            <Card className='Home-card'
              onMouseOver={() => this.setState({usersLinkShadow: 3})}
              onMouseOut={() => this.setState({usersLinkShadow: 1})}
              zDepth={this.state.usersLinkShadow}>
              <div className='Home-iconContainer'>
                <Avatar
                  backgroundColor={secondaryColor}
                  className='Home-icon'
                  icon={<Person />}
                  size={100}
                />
              </div>
              <div className='Home-iconContainer'>
                <p>Manage Users</p>
              </div>
            </Card>
          </NavLink>
        ) : (undefined)}
        <br />
        {this.props.canManageUsers ? (
          <NavLink to={'/tokens'}>
            <Card className='Home-card'
              onMouseOver={() => this.setState({tokensLinkShadow: 3})}
              onMouseOut={() => this.setState({tokensLinkShadow: 1})}
              zDepth={this.state.tokensLinkShadow}>
              <div className='Home-iconContainer'>
                <Avatar
                  backgroundColor={secondaryColor}
                  className='Home-icon'
                  icon={<VpnKey />}
                  size={100}
                  />
              </div>
              <div className='Home-iconContainer'>
                <p>Manage Tokens</p>
              </div>
            </Card>
          </NavLink>
        ) : (undefined)}
      </div>
    )
  }
}

Home.contextTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  canManageUsers: state.authorisation.canManageUsers,
  stroomUiUrl: state.config.stroomUiUrl
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
