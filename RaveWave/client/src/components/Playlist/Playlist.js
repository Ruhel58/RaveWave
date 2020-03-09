import React, { Component } from "react"
import IndividualPlaylist from '../Playlist/IndividualPlaylist'
import {
    Button, 
    Fade, 
    ListGroup, 
    Alert, 
    Modal, 
    ModalHeader, 
    ModalBody,
    Input
} from 'reactstrap'

/**
 * The component will get all the playlists from the user account 
 * and produce a list of them. Each playlist will be a different 
 * component 'IndividualPlaylist'. The ability to create a new 
 * empty playlist is available in this component. 
 */

class Playlist extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal: false,
            profile : null,
            newPlaylist : '',
            newPlaylistSuccess : false
        }
    }

    // user profile can change, always update when opening playlist component
    componentDidMount(){
        this.loadUser()
    }

    toggle =()=> {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    // GET the user profile from the datatbase  
    loadUser =()=> {
        const { token, userid } = this.props
        fetch(
          "/api/user/retrieveuser" + 
          "?token=" + 
          token + 
          "&userid=" + 
          userid,
          {
            method: "GET"
          }
          )
          .then(res => res.json())
          .then(response => {
           
            if (response.success) {      
              this.setState({
                profile : response.user
              })
            } else {
              console.log("ERROR fetching data ");
            }
          })
    }

    /**
     * check if there are any plylists in the user's account. 
     * if there are : produce a list of IndividualPlaylist
     * if there are not : display a meaningful message
     */
    getPlaylists=()=>{
        this.loadUser()
        const { token, userid } = this.props
        const {profile} = this.state
        if (profile){
            if(profile.playlists.length <1) {
                return (
                    <div>
                        <br />
                        <h2 className="subtitle">You seem to have no playlists</h2>
                    </div>
                )
            }

            return (
                profile.playlists.map((playlist) =>{
                    return (
                        <div>
                            <IndividualPlaylist
                                playlist={playlist}
                                token={token}
                                userid = {userid}
                                reloadData = {this.loadUser}
                            /> 
                        </div>
                    )
                })
            )
        } 
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.createPlaylist()
        }
      }

    // when creating a new playlist, keep track of the name the user inputs
    onPlaylistChange = event => {
        this.setState({
            newPlaylist: event.target.value
        });
      };

    /**
     * do not create a playlist if the user input is empty 
     * if correct inputs, add playlist to database, update 
     * and close the modal
     */
    createPlaylist=()=>{  
        const { newPlaylist } = this.state  
        if(newPlaylist === '') {
            this.setState({
                newPlaylistSuccess : false,
                newPlaylistMessage : 'empty'
            })
            return
        }
        this.fetchAndAdd()
        this.getPlaylists() 
        this.toggle() 
    }

    // add a new playlist in the database by sending it to the backend
    fetchAndAdd = async ()=>{  
        const { newPlaylist } = this.state
        const { token, userid } = this.props
        await fetch('/api/user/createplaylist', {
            method : 'POST',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({   
                userid : userid,
                token : token,
                playlistName : newPlaylist
            }),
        })
        .then(res => res.json())
        .then(response => {
            this.setState({
                newPlaylistSuccess : response.success,
                newPlaylistMessage : response.message
            })
        })
        .catch(error => console.error('Error: ', error))  
    }

    render(){
        return(
            <div className="playlists">
                <Fade>
                    <h1 className="title">Playlists</h1>
                    <div>
                        <ListGroup>{this.getPlaylists()}</ListGroup>
                        <Button 
                            color="purple"
                            onClick={this.toggle}
                            className="lowerButtons"
                        >
                            Create Playlist
                        </Button>
                    </div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}> 
                        <ModalHeader toggle={this.toggle}>
                            Create a new playlist
                        </ModalHeader>
                        <ModalBody>
                            <Input 
                                type="text" 
                                placeholder="Playlist Name" 
                                onChange={this.onPlaylistChange}
                                value={this.state.newPlaylist}
                                onKeyPress={this._handleKeyPress}
                            />
                            <Button 
                                className="lowerButtons"
                                color="purple"
                                onClick={this.createPlaylist}>
                                Add Playlist
                            </Button>
                            {
                                (this.state.newPlaylistMessage === 'empty') ? (<div><Alert color="danger ">Enter a name for the playlist</Alert></div>) : (null)
                            }
                        </ModalBody>
                    </Modal>
                </Fade>
            </div>
        )
    }
}
   
export default Playlist