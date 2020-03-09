import React, { Component } from "react";
import {
    Button, 
    Fade, 
    ListGroupItem, 
    Modal, 
    ModalHeader, 
    ModalBody,
    ModalFooter} from 'reactstrap'
import SongInformation from '../SongInformation/SongInformation'
const FileSaver = require('file-saver');

/**
 * Component for one process. Gives users the ability to view songs 
 * open song, delete playlist and export playlist. 
 */

class IndividualPlaylist extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal: false,
            nestedModal: false,
            closeAll: false,
            playlistRemoveMessage : '',
        }
    }

    toggle =()=> {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }
    
      toggleNested =()=> {
        this.setState({
          nestedModal: !this.state.nestedModal,
          closeAll: false
        });
      }
    
      toggleAll =()=>{
        this.setState({
          nestedModal: !this.state.nestedModal,
          closeAll: true
        });
      }

      // extracts the relevant data from the playlist and downloads it to client
      downloadPlaylist =()=>{
        const {playlist} = this.props
    
        let playlistExport = playlist.playlistName + "\n------------------------------------------------------------------\n\n"
      
        for (let i = 0; i < playlist.playlistSongs.length; i++){
            playlistExport += "Song " + (i+1) + ":\n"
            playlistExport += "\t Name: "+playlist.playlistSongs[i].name 
                    + "\n\t Artist: " + playlist.playlistSongs[i].artist 
                    +"\n\t Year: " + playlist.playlistSongs[i].year + "\n\n" 
       
        }
        
        var blob = new Blob([playlistExport], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, playlist.playlistName+".txt", {type: "text/plain;charset=utf-8"});
      }

      // display a list of songs in the playlist 
    getSongs =(playlist)=>{
        const songs = playlist.playlistSongs
        return (
            songs.map((index) =>{
                return (
                    <Fade>
                        <SongInformation 
                            song = {index}
                        />
                    </Fade>
                )
            })
        )
    }

    //  database is updated and front end is updated to show new changes
    deletePlaylist =()=>{
        const { token, userid, playlist, reloadData } = this.props
        if (reloadData === undefined) {
            console.error("Pass in the callback function as a prop")
            return
        }
        fetch('/api/user/removeplaylist', {
            method : 'POST',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({   
                userid : userid,
                token : token,
                playlistid : playlist._id
            }),
        }).then(res => res.json())
        .then(response => {
            if(response.success) {
                this.setState({
                    playlistRemoveMessage : response.message
                })
            }
        })
        reloadData()
        this.toggleAll() 
    }

    render(){
        const {playlist} = this.props
        return(
            <ListGroupItem className="playlistScreen">
                <Fade>
                    <span onClick={this.toggle}><span className="playlistName">{playlist.playlistName}</span></span>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>{playlist.playlistName}</ModalHeader> 
                        <ModalBody>
                            {this.getSongs(playlist)}
                            <br />
                            <Button className="playlistOptions" color="purple" onClick={this.downloadPlaylist}>Download Playlist</Button>
                            <Button className="playlistOptions" color="danger" onClick={this.toggleNested}>Delete Playlist</Button>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                                <ModalBody>Are you sure you want to delete that playlist?</ModalBody>
                                <ModalFooter>
                                    <Button color="purple" onClick={this.toggleNested}>No</Button>{' '}
                                    <Button color="danger" onClick={this.deletePlaylist}>Yes</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                    </Modal>
                </Fade>
            </ListGroupItem>
        )
    }
}

export default IndividualPlaylist