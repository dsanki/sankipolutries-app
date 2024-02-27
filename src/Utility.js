import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';


  export const ErrorMessageHandle = (code,showAlert) => {
    let history = useNavigate();
    if (code === 401) {
         history("/login")
     }
     else if (code === 404) {
         showAlert("Data not found!!", "danger")
     }
     else {
         showAlert("Error occurred!!", "danger")
     }
 };

 export const CalculateAgeInDays = (date) => {
    var a = moment(new Date(), 'DD-MM-YYYY');
    var b = moment(new Date(date), 'DD-MM-YYYY');
    let days = a.diff(b, 'days');
    return days;
  };

  export const CalculateAgeInWeeks = (date) => {
    var a = moment(new Date(), 'DD-MM-YYYY');
    var b = moment(new Date(date), 'DD-MM-YYYY');
    let weeks = a.diff(b, 'week');
    return weeks;
  };

  export const dateyyyymmddhhmmss = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
};

export const dateyyyymmdd = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DD')
};



//  export const fetchShedsList = async () => {
//     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList')
//         .then(response => response.json())
//         .then(data => {
//             setShedList(data);
//         });
// }

// const fetchShedLotMapList = async () => {
//     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList')
//         .then(response => response.json())
//         .then(data => {
//             setShedLotMapList(data);
//         });
// }

 
