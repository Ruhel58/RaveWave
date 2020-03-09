import React, { Component } from 'react';
import AdminOptions from '../AdminOptions/AdminOptions'
import logo from '../resources/logo.svg'
import LogoutComponent from '../LogoutComponent/LogoutComponent'
import { 
  Button, 
  Navbar, 
  NavbarBrand, 
  NavItem, 
  Nav,
  NavbarToggler, 
  Collapse
} 
from 'reactstrap'

class LoggedInBar extends Component {    
    constructor(props){
        
        super(props)
        this.state={
            isOpen: false,
            user : null,
            collapsed: true
        }
    }

  toggle =()=> {
      this.setState({
          isOpen: !this.state.isOpen
      })
    }

    // navigation bar collapses when the menue icon is pressed
    toggleNavbar=()=> {
      this.setState({
        collapsed: !this.state.collapsed
      })
    }

    componentDidMount =()=>{
        this.fetchUserProfile()
    }

    // api call to get the user profile 
    fetchUserProfile = async()=> {
        const { sessionToken, userId } = this.props;
        await fetch(
          "/api/user/retrieveuser" + 
          "?token=" + 
          sessionToken + 
          "&userid=" + 
          userId,
          {
            method: "GET"
          }
        )
          .then(res => res.json())
          .then(response => {
            if (response.success) {
              this.setState({
                user: response.user
              })
            } else {
              console.log("ERROR fetching data ");
            }
          })
    }

    render(){
      // if the api call returns an admin user, set to true
      // setting to true diplays extra menu for admins
        let admin = false
        if(this.state.user) {
            const { status } = this.state.user
            if (status === "admin") {
                admin = true
            }
        }
        let { user } = this.state

        return(
            <div>
                <Navbar color="purple" light >
                    <NavbarBrand href="/" className="mr-2">
                        <img src={logo} alt="logo" width="7%" className="brandLogo"/>
                        <span className="loggedInText">RaveWave</span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-1"/>
                      <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav className="option" navbar>
                        <NavItem>
                          <NavItem>
                            {
                              (user) ?  
                                (<div>
                                    <div className="navbarusername"> 
                                      {user.userName} 
                                    </div>
                                    <div className="navbarname"> 
                                      {user.firstName} 
                                    </div>
                                  </div>
                                ) : 
                              (null)
                            }
                            {
                              (user) ?  (<div className="navbarname"> {user.firstname} </div>) : (null)
                            }
                          </NavItem>
                          <NavItem>
                            <Button className="navoptions" outline color="darkPurple" href="/home">Search</Button>
                          </NavItem>
                          <NavItem>
                            <Button className="navoptions" outline color="darkPurple" href="/playlist">Playlists</Button>
                          </NavItem>
                          <NavItem>
                            <LogoutComponent className="navoptions"  sessionToken={this.props.sessionToken} />
                          </NavItem>  
                          </NavItem>
                          {(admin)? <NavItem ><AdminOptions /></NavItem> : null}
                        </Nav>
                     </Collapse>
                </Navbar>
            </div>

        )
    }


}
export default LoggedInBar;