import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { variables } from './Variables'


export const ErrorMessageHandle = (code, showAlert) => {
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

export const HandleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('isadmin');
}

export const NumberInputKeyDown = (e) => {
  const eventCode = e.code.toLowerCase();
  if (!(e.code !== null
    && (eventCode.includes("digit")
      || eventCode.includes("arrow")
      || eventCode.includes("home")
      || eventCode.includes("end")
      || eventCode.includes("backspace")
      || (eventCode.includes("numpad") && eventCode.length === 7)))
  ) {
    e.preventDefault();
  }
};

export const FetchMortalityList = async () => {

  const response = await fetch(variables.REACT_APP_API + 'Mortality/GetMortalityShedLotMapList',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json()

  return data;
}

export const FetchShedsList = async () => {
  const response = await fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchShedLotMapList = async () => {
  const response = await fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

 

// export function   FetchData() {
//   return new Promise((resolve, reject) => {
//     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
//     {
//       method: 'GET',
//       headers: {
//         'Authorization': localStorage.getItem('token')
//       }
//     })
//       .then(response => {
//         return response.json();
//       })
//       .then(data => resolve(data))
//       .catch(error => reject(error));
//   });
// }

// export const FetchShedLotMapListTest = async () => {
//   const response = await fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
//     {
//       method: 'GET',
//       headers: {
//         'Authorization': localStorage.getItem('token')
//       }
//     });

//   const data = await response.json();
//   return data;
// }

// export const FetchSheds = async () => {
//   const response = await fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList',
//     {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': localStorage.getItem('token')
//       }
//     });
//   const data = await response.json();
//   return data;
// }





// export const FetchMortalityList = async () => {


//   const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
//   const data = await response.json()


//  await fetch(variables.REACT_APP_API + 'Mortality/GetMortalityShedLotMapList',
//     {
//       method: 'GET',
//       headers: {
//         'Authorization': localStorage.getItem('token')
//       }
//     })
//     .then(response => await response.json())
//     .then(data => {
//       if(data.StatusCode===200)
//       {

//       }
//       return data;
//     });
// }



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


