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

import List, { ListItem, ListItemText } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'

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
