import React, { Component } from 'react';
import { Fade, Badge} from 'reactstrap'
import './Home.css';
import { getFromStorage } from '../../utils/local-storage'
import LoginBox from '../LoginBox/LoginBox'
import SignUpBox from '../SignUpBox/SignUpBox'
import SearchScreen from '../SearchScreen/SearchScreen'
import HomeBar from '../NavBars/HomeBar'
import LoggedInBar from '../NavBars/LoggedInBar'
import axios from 'axios'

import { 
    BrowserRouter, 
    Route, 
    Redirect, 
    Switch
} 
from 'react-router-dom'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading : true,
            token : '',
            userId : ''
        }
    }

    // methods to handle any callbacks being called by child components

    handleCallbackSetLoadingToTrue =()=>{
        this.setState({
            loading : true
        })
    }

    handleCallbackSetLoadingToFalse =()=>{
        this.setState({
            loading : false
        })
    }

    handleCallbackUpdateToken =(data, id)=> {
        this.setState({
            userId : id,
            token : data
        })
    }

    signedIn(){
        this.setState({
            loading : false
        })
    }

    // takes the given token and verifies it on the server
    fetchAndVerifyToken (token, userid){
        fetch('/api/user/verify?token=' + token)
        .then(res => res.json())
        .then(response => {
            console.log("Success: " + response.success)
            if (response.success) {
               // token is found and matches the one in the database.
                this.setState({
                    userId : response.userId,
                    token : token,
                    loading : false
                })
            } else {
                this.setState({
                    loading : true
                })
                return
            }
        })
    }

    /**
     * check if the user is already logged in 
     * by verifying the token stored in the local 
     * storage.
     */

    componentDidMount =()=>{
        const jsonFile = getFromStorage('RaveWave')
        if (jsonFile !== null){
            console.log("Previous Token is found: " + jsonFile.token)
        } else {
            console.log("Staring new login session")
        }
        if (jsonFile && jsonFile.token ) {
            const token  = jsonFile.token
            const userid = jsonFile.userid
            this.fetchAndVerifyToken(token, userid)
        } else {
             this.setState({
                 loading : false
             })
        }
    }

    fetchUserProfile=()=> {
        const { sessionToken, userId } = this.props;
        axios.get(
          "/api/user/retrieveuser" + 
          "?token=" + sessionToken + 
          "&userid=" + userId,
          )
          .then((res) => {
            const response = res.data
            if (response.success) {      
              this.setState({
                userProfile: response.user
              })
            } else {
              console.log("ERROR fetching data ");
            }
          })
      }

  render() {
    const invalidUrl =()=>{
        return <h2>404 not found </h2>
    }
      const {
        loading,
        token
      } = this.state

      /**
       * check if user is already logged in. 
       * Compare local token with the token in the database
       * if exists == true, then they are already logged in
       * */
      if (!token) {
          /**
           * Token does not exist. Implies that user is not logged in. 
           * Display all these components and elements. 
           * Also, set up the routes for the login & signup components
           * Display the homebar navigation. This navigation bar is unique 
           * to this component. 
           * */
          
          return (
            <div className="universal">
                <BrowserRouter>
                    <Switch>           
                        <Route 
                            path='/' exact 
                            render={() => 
                                <Fade>
                                    <HomeBar />
                                        <div className="welcomeText">
                                            <Fade>
                                                <h1 className="title">Listen to what you feel</h1> 
                                                <h2 className="sub-title">Sign up today and find songs that match your mood</h2>
                                                <h1><Badge href="/signup" color="purple" size='xl' className="defaultButton" pill><div className="text">Signup</div></Badge></h1>
                                            </Fade>    
                                        </div>  
                                </Fade>
                            }
                        />
                        
                        <Route 
                            path='/signup' exact 
                            render={(props) => 
                                <div>
                                    <HomeBar />
                                    <SignUpBox {...props} 
                                        triggerSetLoadingToTrue = { 
                                            this.handleCallbackSetLoadingToTrue 
                                        } 
                                        triggerSetLoadingToFalse = { 
                                            this.handleCallbackSetLoadingToFalse 
                                        } 
                                    />
                                </div>
                            }
                        />
                        <Route
                            path='/login' exact 
                            render={(props) =>  
                                <div>
                                <HomeBar /> 
                                    <LoginBox {...props}
                                        triggerUpdateToken = { 
                                            this.handleCallbackUpdateToken 
                                        }
                                        triggerSetLoadingToTrue = { 
                                            this.handleCallbackSetLoadingToTrue 
                                        }
                                        triggerSetLoadingToFalse = { 
                                            this.handleCallbackSetLoadingToFalse 
                                        }
                                    />
                                </div>
                            }
                        />
                        <Route component={invalidUrl}/>
                    </Switch>
                </BrowserRouter>  
            </div>
          )   
      }

      if (loading) {
        return (
          <div>
              <p>Loading ... </p>
          </div>
        )
    }

  // display the components if they are logged in
    return (
        <BrowserRouter>
            <div className="default">
                <Redirect to="/home" />
                <LoggedInBar
                    className="NavigationBar"
                    sessionToken = { this.state.token }
                    userId = { this.state.userId } 
                />
                <SearchScreen
                    sessionToken = { this.state.token }
                    userId = { this.state.userId }
                />  
                </div>
        </BrowserRouter>
    )
  }
}

export default Home;
