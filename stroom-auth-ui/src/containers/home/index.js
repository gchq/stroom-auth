import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Card from 'material-ui/Card'
import Person from 'material-ui-icons/Person'
import {amber900 as secondaryColor} from 'material-ui/styles/colors'

import './Home.css'
import '../Layout.css'
import icon from '../../icon.png'
import { goToStroom } from '../../modules/sidebar'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stroomLinkShadow: 1,
      usersLinkShadow: 1
    }
  }

  onMouseOver = () => this.setState({shadow:3})
  onMouseOut = () => this.setState({shadow:1})

  render() {
    return (
      <div className="content-floating-with-appbar vertical">
        <NavLink to='/'>
          <Card className="Home-card" 
          onClick={() => this.props.goToStroom(this.props.token)} 
            onMouseOver={() => this.setState({stroomLinkShadow:3})} 
            onMouseOut={() => this.setState({stroomLinkShadow:1})} 
            zDepth={this.state.stroomLinkShadow}>
            <div className="Home-iconContainer">
              <Avatar
                className="Home-icon"
                src={icon}
                size={100}
              />
            </div>
            <div className="Home-iconContainer">
              <p>Go to Stroom</p>
            </div>
          </Card>
        </NavLink>
        <br/>
          {this.props.canManageUsers ? (
          <NavLink to='/userSearch'>
            <Card className="Home-card"
              onMouseOver={() => this.setState({usersLinkShadow:3})}
              onMouseOut={() => this.setState({usersLinkShadow:1})}
              zDepth={this.state.usersLinkShadow}>
              <div className="Home-iconContainer">
                <Avatar
                  backgroundColor={secondaryColor}
                  className="Home-icon"
                  icon={<Person/>}
                  size={100}
                />
              </div>
              <div className="Home-iconContainer">
                <p>Manage Users</p>
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
  token: state.login.token,
  canManageUsers: state.login.canManageUsers
})

const mapDispatchToProps = dispatch => bindActionCreators({
  goToStroom
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)