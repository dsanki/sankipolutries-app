import react, { useState } from "react";
import CommonContext from "./CommonContext";
import { variables } from './../Variables';
//import { useNavigate } from 'react-router-dom'

const CommonState = (props) => {
   // let history = useNavigate();
     const errorMessageHandle= (code,showAlert) => {
        if (code === 401) {
           // history("/login")
        }
        else if (code === 404) {
            showAlert("Data not found!!", "danger")
        }
        else {
            showAlert("Error occurred!!", "danger")
        }
    }

    return (
        <CommonContext.Provider value={{ errorMessageHandle}}>
            {props.children}
        </CommonContext.Provider>
    )
}

export default CommonState;