import React, { Component } from 'react';
import './LogoutComponent.css';
import  { Route } from 'react-router-dom'
import { Button } from 'reactstrap';

class LogoutComponent extends Component {

    /**
     * Component is just one button. 
     * Clicking the button will do a an api to the server and log the current user out
     * LoginSession is modified
     */

    constructor(props){
        super(props)
        this.state = {
            logoutMessage : ''
        }
    }

    fetchAndLogout =(token)=>{
    
        fetch('/api/user/logout?token=' + token)
        .then(res => res.json())
        .then(response => {
            // possible error handling in the future
            if (response.success) {
                this.setState({
                    logoutMessage : response.message
                })
                //refresh the page
                window.location.reload();
            } else {
                this.setState({
                    logoutMessage : response.message
                })
            }
        })
    }
    
    render(){
        return(
            <div>
                <Route 
                    render={({ history }) => (
                        <Button outline color="darkPurple" className="navoptions"
                            type='button'
                            onClick={() => {
                                history.push('/')
                                this.fetchAndLogout(this.props.sessionToken)
                            }}
                        >
                        Logout
                        </Button>
                    )} 
                />
            </div>
        )
    }

}

export default LogoutComponent;

