import React, { Component } from 'react'
import { Button, Collapse, Card, CardBody} from 'reactstrap'
import google from '../resources/googleplay.svg'
import youtube from '../resources/youtube.svg'
import spotify from '../resources/spotify.svg'
import deezer from '../resources/deezer.svg'

class SongInformation extends Component {
    constructor(props){
        super(props)

        this.state={
            collapse : false
        }
    }
    toggle =()=> {
        this.setState(state => ({ collapse: !state.collapse }));
      }

    render(){
        const { song } = this.props
        return(
            <div>
                <div onClick={this.toggle} className="songName"><strong>{song.name}</strong> by {song.artist}</div>
                <Collapse isOpen={this.state.collapse}>
                    <Card>
                        <CardBody>
                            <strong>Name:</strong> {song.name}
                            <br />
                            <strong>Artist:</strong> {song.artist}
                            <br />         
                            <strong>Album:</strong> {song.albumName}
                            <br />
                            <strong>Year:</strong> {song.year}
                            <br /> <strong>Open via:</strong> 
                            <br />
                                {(song.youtubeUrl)? 
                                    (<a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" > 
                                        <img src={youtube} alt="youtube logo" className="icons"/>
                                    </a>) : 
                                (null)}

                                {(song.spotifyUrl)? 
                                    (<a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" >
                                        <img src={spotify} alt="spotify logo" className="icons"/>
                                    </a>) : 
                                (null)}

                                {(song.googleMusicUrl)? 
                                    (<a href={song.googleMusicUrl} target="_blank" rel="noopener noreferrer" >
                                        <img src={google} alt="google music logo" className="icons"/>
                                    </a>) :
                                (null)}

                                {(song.deezerUrl)? 
                                    (<a href={song.deezerUrl} target="_blank" rel="noopener noreferrer" >
                                        <img src={deezer} alt="deezer logo" className="icons"/>
                                    </a>) : 
                                (null)}

                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        )
    }
}

export default SongInformation