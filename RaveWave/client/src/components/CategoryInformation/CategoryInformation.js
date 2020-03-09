import React, { Component } from "react";
import { 
    Button, 
    Popover, 
    PopoverHeader, 
    PopoverBody, 
    Fade, 
    DropdownItem, 
    Alert, 
    InputGroupAddon,  
    Input, 
    InputGroup, 
    InputGroupText
} 
from 'reactstrap'
import SongInformation from '../SongInformation/SongInformation'

class CategoryInformation extends Component {
    constructor(props){
        super(props)
        this.state={
            addToPlaylistsuccess : false,
            popoverOpen: false,
            modal: false,
            message :'',
            newPlaylist : '',
            newPlaylistMessage : '',
            newPlaylistSuccess : false,
            toAdd : [],
            playlists : this.props.profile.playlists,
            userProfile : null,
            
        }      
        console.log(this.state.playlists)
    }

    fetchAndAdd =(name, token, userid)=>{  
     
        fetch('/api/user/createplaylist', {
            method : 'POST',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({   
                userid : userid,
                token : token,
                playlistName : name
            }),
        })
        .then(res => res.json())
        .then(response => {
            this.fetchUserProfile()
            this.setState({
                newPlaylistSuccess : response.success,
                newPlaylistMessage : response.message
            })
        })
        .catch(error => console.error('Error: ', error))  
    }

    fetchUserProfile=()=> {
        const { token, profile } = this.props;
        fetch(
          "/api/user/retrieveuser" + 
          "?token=" + token + 
          "&userid=" + profile._id,
          {
            method: "GET"
          }
          )
          .then(res => res.json())
          .then(response => {
           
            if (response.success) { 
                console.log("yes")         
                this.setState({
                    playlists : response.user.playlists
                })
            } else {
                console.log("ERROR fetching data ");
            }
          })
    }

    togglePopover =()=> {
        this.setState({
          popoverOpen: !this.state.popoverOpen
        });
    }

    toggleModal =()=> {
        this.setState(prevState => ({
            modal: !prevState.modal
          }));
    }

    updateCheckState =(e)=>{
        if (e.target.checked){      
            this.setState({
                toAdd: this.state.toAdd.concat([e.target.value])
                })
        } else {
            this.setState({
                toAdd : this.state.toAdd.filter(function(val) {return val!==e.target.value})
                })
        }
    }

    // display all the songs in the category
    getSongs =()=>{
        const {result} = this.props
        const songs = result.songs

        return (
            songs.map((index) =>{
                return (
                    <div className="listOfSongs">
                        <InputGroupText>
                            <Input addon type="checkbox" value={index._id} onClick={this.updateCheckState}/>
                            <SongInformation 
                            song = {index}
                        />
                        </InputGroupText>
                    </div>
                )
            })
        )
    }

    // display all the user playlist
    getPlaylists =()=>{  
        return (
        this.state.playlists.map((playlist) =>{
            return (
                <Fade>
                    <Button onClick={() => this.addToPlaylist(playlist)} color="link">{playlist.playlistName}</Button>
                </Fade>
                )
            })
        )
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.createPlaylist()
        }
      }

    // make multiple fetch requests in order to add all the selected song
    // async and await used to ensure one request is completed before moving to the next
    addToPlaylist = async (playlist)=>{
        const size = this.state.toAdd.length
        for (let i =0; i < size; i++){
            let songid = this.state.toAdd[i]
            const { profile } = this.props
           
            await fetch('/api/user/addsongtoplaylist', {
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({   
                    userid: profile._id ,
                    token : this.props.token,
                    playlistid : playlist._id, 
                    songid : songid
                }),
            })
            .then(res => res.json())
            .then(async response => {
                this.setState({
                    message : response.message, 
                    addToPlaylistsuccess : response.success
                })
            })
            .catch(error => console.error('Error: ', error)) 
            this.togglePopover()  
            this.forceUpdate()
        }
    }

    handleCallback =(message, success)=> {
        this.setState({
            newPlaylistMessage : message,
            newPlaylistSuccess : success
        })
    }

    createPlaylist=()=>{
        const {newPlaylist} = this.state
        if(newPlaylist === '') {
            this.setState({
                newPlaylistSuccess : false,
                newPlaylistMessage : 'empty'
            })
            return
        }
        const {token, profile} = this.props
        this.fetchAndAdd(newPlaylist, token, profile._id)
        this.getPlaylists()
        this.forceUpdate()
    }

    onPlaylistChange = (event) => {
        this.setState({
            newPlaylist: event.target.value
        });
      };

    render(){
        return(
            <Fade>
                {this.getSongs()}
                < br />
                <Button color="purple" id="Popover1">Add to playlist</Button>
                {
                    (this.state.addToPlaylistsuccess) ? (<Alert>Song succesfully added to playlist</Alert>) : (null)
                } 
                <Popover placement="left" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopover}>
                <PopoverHeader>Playlists</PopoverHeader>
                <PopoverBody className ="popoverBody" >{this.getPlaylists()}
                <DropdownItem divider />
                <InputGroup>
                    <h6>Create Playlist</h6>
                </InputGroup>
                <InputGroup size="md" className="search">
                    <Input 
                        type="text" 
                        placeholder="Playlist Name" 
                        onChange={this.onPlaylistChange}
                        value={this.state.newPlaylist}
                        onKeyPress={this._handleKeyPress}
                    />
                    <InputGroupAddon addonType="append">
              <Button 
                color="purple"
                onClick={this.createPlaylist}>
                Add
              </Button>
            </InputGroupAddon>
                    {
                        (this.state.newPlaylistMessage === 'empty') ? (<div><Alert color="danger ">Enter a name for the playlist</Alert></div>) : (null)
                    }
                </InputGroup>
                </PopoverBody>
                </Popover>
            </Fade>

        )
    }
}

export default CategoryInformation