import React from 'react'
import TextField from 'material-ui/TextField'

import List, { ListItem, ListItemText } from 'material-ui/List'
import Menu, { MenuItem } from 'material-ui/Menu'

import UserStateMenu from './containers/userStateMenu'

export const renderInput = ({
  input,
  label,
  meta: { touched, warning, error },
  ...custom
}) =>
  <div>
    <TextField
      placeholder={label}
      {...input}
      {...custom}
    />
    {touched &&
      ((error &&
        <span>
          {error}
        </span>) ||
        (warning &&
          <span>
            {warning}
          </span>))}
  </div>






var anchorEl = undefined
var open = false
var selectedIndex = 0
var button = undefined

  const handleClickListItem = event => {
    console.log("HCLI:"+open)
        console.log("HCLI:"+this.open)

    this.open = true
    console.log("HCLI:"+open)
    console.log("HCLI:"+this.open)
    // anchorEl = event.currentTarget
    // this.setState({ open: true, anchorEl: event.currentTarget })
  }

  const handleMenuItemClick = (event, index) => {
    console.log("HMIC:"+open)
    console.log("HMIC:"+this.open)
    console.log("HMIC:"+open)
    console.log("HMIC:"+this.open)
    // selectedIndex = index
    // open = false
    // this.props.onChange(index)
  }

  const handleRequestClose = () => {
    console.log("HRC")
    // open = false
  }

  const options = [
    'Enabled',
    'Disabled',
    'Locked',
  ]

  export const renderUserStateMenu = ({
    input,
    label,
    meta: {touched, warning, error},
    ...custom
  }) => 
    <div>
        <List>
          <ListItem
          primaryText="The state of this user"/>
        </List>
          <Menu
         id="state-menu"
          anchorEl={anchorEl}
          open={this.open}
          onRequestClose={handleRequestClose}
        >
         { options.map((option, index) =>
            <MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={event => handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>,
          )}
        </Menu>  
         
      </div>
  

  