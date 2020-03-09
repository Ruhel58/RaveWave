import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Navbar, NavbarBrand, NavItem, Nav, Fade} from 'reactstrap'

import logo from '../resources/logo.svg'

class HomeBar extends Component {
  
    render(){
        return(
            <div>
                <Fade>
                    <Navbar color="purple" light expand="xs">
                        <NavbarBrand href="/" >
                            <img src={logo} alt="logo" width="7%" className="brandLogo"/>
                            <span className="brandText">RaveWave</span>
                        </NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink className="hyp" to="/signup">Signup</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="hyp"  to="/login">Login</NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                </Fade>
            </div>
        )
    }
}

export default HomeBar;