import React, { Component } from 'react'
import { Alert, Form, FormGroup, Input, Fade, Badge } from 'reactstrap'

class SignUpBox extends Component {
    constructor(props){
        super(props)
        this.state = {
            usernameSignup : '',
            passwordSignup : '',
            firstnameSignup : '',
            lastnameSignup : '',
            emailSignup : '',
            signUpMessage : '',
            success : false
        }
    }
    /**
     * Fetch the URL and send JSON data to the server
     * Server will respond with a message
     * Get the response and set the response to the state
     * callback is trigger and parent componenet's state is changed
     */
    fetchAndSignup =()=>{
        const { triggerSetLoadingToFalse } = this.props
        if (triggerSetLoadingToFalse === undefined) {
            console.error("Pass in the callback function as a prop")
            return
        }
        const {
            usernameSignup,
            passwordSignup,
            firstnameSignup,
            lastnameSignup,
            emailSignup
        } = this.state    
        
        fetch('/api/user/signup', {
            method : 'POST',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({   
                userName : usernameSignup ,
                firstName : firstnameSignup,
                lastName : lastnameSignup ,
                email : emailSignup,
                password : passwordSignup,
            }),
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                triggerSetLoadingToFalse()
                this.setState({
                    signUpMessage : response.message, 
                    success : response.success,
                    firstnameSignup : '',
                    lastnameSignup : '',
                    usernameSignup : '',
                    passwordSignup : '',
                    emailSignup : '',
                })
            } else {
                this.setState({
                    signUpMessage : response.message, 
                })
            }
        })
        .catch(error => console.error('Error: ', error))  
    }
    
    // button on change method
    onClickSignup =()=>{
        this.fetchAndSignup()
    }

    // update the state with the user input
    onTextBoxChangeUsername =(event)=>{
        this.setState({
            usernameSignup : event.target.value
        })
    }

    onTextBoxChangePassword =(event)=>{
        this.setState({
            passwordSignup : event.target.value
        })
    }

    onTextBoxChangeFirstName =(event)=>{
        this.setState({
            firstnameSignup: event.target.value
        })
    }
    onTextBoxChangeLastName =(event)=>{
        this.setState({
            lastnameSignup : event.target.value
        })
    }
    onTextBoxChangeEmail =(event)=>{
        this.setState({
            emailSignup: event.target.value
        })
    }

    // output the compoenent
    render(){
        const {
            usernameSignup, 
            passwordSignup, 
            firstnameSignup, 
            lastnameSignup, 
            emailSignup,
            signUpMessage,
            success
        } = this.state
        return(
            <Form className="userForm">
                <Fade>
                    <FormGroup>
                        <h3 className="formTitle">Sign up</h3>
                    </FormGroup>
                    <FormGroup>
                            <Input 
                                type="text" 
                                placeholder="First Name" 
                                value={firstnameSignup}
                                onChange={this.onTextBoxChangeFirstName}
                            /> 
                    </FormGroup>
                    <FormGroup>
                            <Input 
                                type="text" 
                                placeholder="Last Name" 
                                value={lastnameSignup}
                                onChange={this.onTextBoxChangeLastName}
                            />
                    </FormGroup>
                    <FormGroup>
                            <Input 
                                type="email" 
                                placeholder="Email" 
                                value={emailSignup}
                                onChange={this.onTextBoxChangeEmail}
                            /> 
                    </FormGroup>
                    <FormGroup>
                            <Input 
                                type="text" 
                                placeholder="Username" 
                                value={usernameSignup}
                                onChange={this.onTextBoxChangeUsername}
                            /> 
                    </FormGroup>
                    <FormGroup>
                            <Input 
                                type="password" 
                                placeholder="Password" 
                                value={passwordSignup}
                                onChange={this.onTextBoxChangePassword}
                            /> 
                    </FormGroup>
                    <FormGroup>
                        <h1><Badge href="#" color="purple" onClick={this.onClickSignup} size='xl' className="defaultButton" pill><div className="text">Signup</div></Badge></h1>
                    </FormGroup>
       
                    <FormGroup>
                        {
                            (signUpMessage) ? (<Alert color={(success) ? ("success") : ("danger")} fade="true" size="xs">{signUpMessage}</Alert>) : (null)
                        }
                    </FormGroup>
                </Fade>
            </Form>
        )
    }
}


export default SignUpBox;
