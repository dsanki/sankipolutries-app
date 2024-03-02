import React from 'react'
import Loader from '../../image/Loader.gif'

function Loading() {
    return (
        <div className="divLoading">
            <p className="loading">
                <img src={Loader} alt='loading' width={100} />
            </p>
        </div>
    )
}

export default Loading
