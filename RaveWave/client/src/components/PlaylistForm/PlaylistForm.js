import React, { Component } from "react";

class PlaylistForm extends Component {
    constructor(props){
        this.onClickAdd()
        super(props)
        this.state = {
            playlistName : '',
            message: '',
            success: false
        }
    }
   
    fetchAndAdd=()=>{
        const { triggerCallBack, name, token, userid} = this.props
        if (triggerCallBack === undefined) {
            console.log("Pass a function as a prop")
            return
        }
        const {
            playlistName,
            message,
            success
        } = this.state    
        
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
            console.log(response.message)
            triggerCallBack(response.message, response.success)
            if (response.success) {
                console.log('Success: ', JSON.stringify(response))
                this.setState({
                    newPlaylistMessage : response.message, 
                    newPlaylistSuccess : response.success,
                    
                })
            } else {
                this.setState({
                    newPlaylistMessage : response.message, 
                    newPlaylistSuccess : false
                    
                })
            }
        })
        .catch(error => console.error('Error: ', error))  
    }

    // action to perfrom when user clicks 'add'
    onClickAdd =()=>{
        this.fetchAndAdd()
    }

    // change the state as the user types
    changeName =(event)=>{
        this.setState({
            playlistName : event.target.value
        })
    }
    componentDidMount(){
        console.log("inside")
        this.onClickAdd()
    }

    render(){
   
        return(
            <div></div>
        )
    }


}

export default PlaylistForm