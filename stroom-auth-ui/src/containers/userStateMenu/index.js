import React, { Component } from 'react'
import PropTypes from 'prop-types'

import List, { ListItem, ListItemText } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export default class UserStateMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: undefined,
      open: false,
      selectedIndex: props.value,
    }
  }

  button = undefined

  handleClickListItem = event => {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, open: false })
    this.props.onChange(index)
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  render() {
    const options = [
      'Enabled',
      'Disabled',
      'Locked',
    ]
    return (
      <div>
        <List>
          <ListItem
            button
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary="The state of this user"
              secondary={options[this.state.selectedIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id="state-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          { options.map((option, index) =>
            <MenuItem
              key={option}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>,
          )}
        </Menu>
      </div>
    )
  }
}

UserStateMenu.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}
