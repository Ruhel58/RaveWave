import React, { Component } from 'react';
import { setToStorage } from '../../utils/local-storage'
import { Alert, Form, FormGroup, Input, Fade, Badge } from 'reactstrap'
import {BrowserRouter } from 'react-router-dom'

class LoginBox extends Component {
    constructor(props){
        super(props)
        this.state = {
            usernameLogin : '',
            passwordLogin : '',
            loginMessage : '',
            success : false
        }
    }

    // Access the server and check if username and password is correct
    // display the message which the server returns
    fetchAndLogin(){
        //declare the callback functions and verify that they have been sent as a prop
        const { triggerSetLoadingToFalse } = this.props
        if (triggerSetLoadingToFalse === undefined) {
            return
        }

        const { triggerUpdateToken } = this.props
        if ( triggerUpdateToken === undefined) {
            return
        }

        const {
            usernameLogin,
            passwordLogin
        } = this.state    

        // submit the username and password to the server
        fetch('/api/user/login', {
            method : 'POST',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({   
                userName : usernameLogin,
                password : passwordLogin
            }),
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                console.log("response " + response.user_id)
                triggerUpdateToken(response.token, response.user_id)
                triggerSetLoadingToFalse()
                setToStorage('RaveWave', {token : response.token, userid : response.user_id}, )
                this.setState({
                    usernameLogin: '',
                    passwordLogin: '',
                    loginMessage: response.message
                })
            } else {
                this.setState({
                    loginMessage : response.message,
                    success : response.success 
                })
            }
        })
        .catch(error => console.error('Error: ', error))  
    }

    onClickLogin =()=>{
        this.fetchAndLogin()
    }

    // update the state with the user input

    onTextBoxChangeUsername =(event)=>{
        this.setState({
            usernameLogin : event.target.value
        })
    }

    // button on change method
    onTextBoxChangePassword =(event)=>{
        this.setState({
            passwordLogin : event.target.value
        })
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.fetchAndLogin()
        }
      }

    render(){
        const {
            usernameLogin,
            passwordLogin,
            loginMessage,
            success
        } = this.state
        return(
            <Form className="userForm">
                <Fade>
                    <FormGroup>
                        <h3 className="formTitle">Login</h3>
                    </FormGroup>
                    <FormGroup>
                        <Input 
                            type="text" 
                            placeholder="Username" 
                            value={usernameLogin}
                            onChange={this.onTextBoxChangeUsername}
                            onKeyPress={this._handleKeyPress}
                        /> 
                    </FormGroup>
                    <FormGroup>
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            value={passwordLogin} 
                            onChange={this.onTextBoxChangePassword}
                            onKeyPress={this._handleKeyPress}
                        /> 
                    </FormGroup>       
                    <FormGroup>
                        <h1><Badge href="#" color="purple" onClick={this.onClickLogin} size='xl' className="defaultButton" pill><div className="text">Login</div></Badge></h1>
                    </FormGroup>
                    <FormGroup>
                        {console.log(loginMessage)}
                        {
                            (loginMessage) ? (<Alert color={(success) ? ("success") : ("danger")} fade="true" size="xs">{loginMessage}</Alert>) : (null)  
                        }
                    </FormGroup>
                    
                </Fade>
                <BrowserRouter>
                  
                </BrowserRouter>
            </Form>
        )
    }
}


export default LoginBox;
