import React, { Component } from "react";
import Result from '../Result/Result'
import Playlist from '../Playlist/Playlist'

import { 
  BrowserRouter, 
  Route, 
  Switch, 
  Redirect 
} from 'react-router-dom'

import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
  ListGroup,
  Alert
} from "reactstrap";

/**
 * This component will diplay the search screen (search bar). It is also the 
 * home page--the first screen the user will see when they log in. 
 * The results are also shown in the same screen, not a new screen. 
 * 
 */

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      query: '',
      message: '',
      count : 0,
      results : null,
      success : false
    };
  }

  /**
   * Send the query 
   */
  fetchAndSearch(){
    const { sessionToken, userId } = this.props;
    fetch(
      "/api/user/search" + 
      "?token=" + sessionToken + 
      "&userid=" + userId +
      "&search=" + this.state.query,
      {
        method: "GET"
      }
    )
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        this.setState({
          message: response.message,
          count : response.count,
          results : response.results,
          success : response.success
        })
      } else {
        this.setState({ 
          success : response.success,
          message : response.success
        })
      }
    })
    }
       
  componentDidMount() {
    this.fetchUserProfile();
  }

  onClickSearch =()=>{
    this.fetchAndSearch()
  }

  // update the state as the user types in the search box
  onSearchChange = event => {
    this.setState({
      query: event.target.value
    });
  };

  // allow the user to press 'enter' to search for a category
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.fetchAndSearch()
    }
  }

  displayResults =()=>{
    return (
      <div>
      <br />{
      this.state.results.map((result) =>{
        return (
          <div>
            <Result 
              token={this.props.sessionToken}
              result={result} 
              profile={this.state.userProfile}
            />
            </div>
        )
      })
    }</div>
    )    
  }

  /** 
   * User details always changes. Example, when the user adds a playlist in their 
   * account. Updates are made in the server, not in the client. It is crucial to 
   * always have an updated profile. The method retrieves the updated user profile.
   * */

  fetchUserProfile=()=> {
    const { sessionToken, userId } = this.props;
    fetch(
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
          console.log("yes")         
          this.setState({
            userProfile: response.user
          })
        } else {
          console.log("ERROR fetching data ");
        }
      })
  }

  // returns the server response and prettifies it. 
  processQuery =()=>{
    const { 
      results, 
      success, 
      message} = this.state

    if (success){
      if (results.length <1) {
        return (<Alert color="danger">{message}</Alert>)
      } else {
        return (
          <div>
            <br />
            <div className="searchResltsTitle">{message}</div>
            <ListGroup>{this.displayResults()}</ListGroup>
        </div>
        )
      }
    }
  }

  render() {
    const { query } = this.state

    return (
      <div className="searchScreen">
      <BrowserRouter>
        <Switch>
          <Route 
            path='/playlist' exact 
            render={(props) => 
                <div>
                    <Playlist {...props} 
                      userid={this.props.userId}
                      token={this.props.sessionToken}
                      />
                </div>
                }
          />
          <Route 
            path='/home' exact 
            render={(props) => 
              <div>
                <InputGroup >
                  <h4 className="title">Search Mood</h4> 
                </InputGroup>
                <InputGroup size="md" className="searchScreenField">
                  <Input  
                    type="text" 
                    placeholder="Enter mood/genre" 
                    onChange={this.onSearchChange}
                    value={query}
                    onKeyPress={this._handleKeyPress}
                  />
                  <InputGroupAddon addonType="append">
                    <Button 
                      color="purple"
                      onClick={this.onClickSearch}>
                      Search
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <div>
                  {this.processQuery()}
                </div>
              </div>
          }/>
          <Redirect to="/home" />
        </Switch>
      </BrowserRouter>
      </div>
    )
  }
}

export default SearchScreen;
