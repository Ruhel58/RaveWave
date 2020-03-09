// takens the given token and verifies it on the server
export function fetchAndVerifyToken(token){
    fetch('/api/user/verify?token=' + token)
    .then(res => res.json)
    .then(json => {
        if (json.success) {
            this.setState({
                token : token,
                loading : false
            })
        } else {
            this.setState({
                loading : true
            })
        }
    })
}

export function fetchAndAdd (name, token, userid){  
    let returnObj = null  
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
            
    })
    .catch(error => console.error('Error: ', error))  
    console.log("again")
}