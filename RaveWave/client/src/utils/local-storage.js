export function getFromStorage(key){
    if(!key) {
        return null
    }
    try {
        const value = localStorage.getItem(key)
        if (value) {
             return JSON.parse(value)
        }
        return null
    } catch (err){
        return null
    }
}

export function setToStorage(key, obj){
    console.log("adding...")
    if (!key){
        console.error('Key is missing')
    }
    try {
        localStorage.setItem(key, JSON.stringify(obj))
    } catch (err){ 
        console.error('Error: ' + err)
    }
    console.timeLog(localStorage.getItem(key))
}