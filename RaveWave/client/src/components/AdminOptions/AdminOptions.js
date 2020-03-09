import React, { Component } from 'react';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

class AdminOptions extends Component {
    render(){
        return(
            <UncontrolledDropdown nav inNavbar color="darkPurple">
            <DropdownToggle nav caret>
              Admin
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Add Song
              </DropdownItem>
              <DropdownItem>
                Remove Song
              </DropdownItem>
              <DropdownItem>
                Remove User
              </DropdownItem>
              <DropdownItem>
                Create Category
              </DropdownItem>
              <DropdownItem>
                Remove
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )
    }

}

export default AdminOptions;
