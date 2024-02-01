import React from 'react'

function Alert(props) {
    const cap=(word)=>{
        if(word==="danger")
        {
            word="error";
        }
    }

    //if(props.)
    return (
        <div>
            {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
              <strong>{cap(props.alert.type)}</strong> {props.alert.msg}
            </div>}
        </div>
    )
}

export default Alert
