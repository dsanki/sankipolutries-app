//import react, { useState } from "react";
import LotContext from "./LotContext";
//import { variables } from './../Variables';

const LotState = (props) => {
    // // Add a Lot
    // const addLot = async (lotname, startdate, enddate) => {
    //     //e.preventDefault();
    //     // TODO: API Call
    //     // API Call 
    //     const response = await fetch(variables.REACT_APP_API + 'LotMaster', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': localStorage.getItem('token')
    //         },
    //         body: JSON.stringify({ lotname, startdate, enddate })
    //     });

    //     const _lot = await response.json();
    // }


    // const editLot =async (lotid, lotname, startdate, enddate) => {
    //     //e.preventDefault();
    //     const response = await fetch(variables.REACT_APP_API + 'LotMaster', {
    //         method: 'PUT',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             Id: lotid,
    //             LotName: lotname,
    //             StartDate: startdate,
    //             EndDate: enddate

    //         })
    //     });

    //     const _lot = await response.json();
    //         // .then(res => res.json())
    //         // .then((result) => {
    //         //     alert(result);
    //         // },
    //         //     (error) => {
    //         //         alert('Failed');
    //         //     })
    // };

    // const errorHandle = (code) => {
    //     if (code === 401) {
    //         history("/login")
    //     }
    //     else if (code === 404) {
    //         props.showAlert("Data not found!!", "danger")
    //     }
    //     else {
    //         props.showAlert("Error occurred!!", "danger")
    //     }
    // }



    return (
         <LotContext.Provider>
            {props.children}
        </LotContext.Provider>
        // <LotContext.Provider value={{ addLot ,editLot}}>
        //     {props.children}
        // </LotContext.Provider>
    )
}

export default LotState;