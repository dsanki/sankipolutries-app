import React from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { variables } from './Variables'
import * as XLSX from 'xlsx';


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


export const FetchChicks = async () => {
  const response = await fetch(variables.REACT_APP_API + 'ChicksMaster',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchLotById = async (id) => {
  const response =await fetch(variables.REACT_APP_API + 'ChicksMaster/' + id,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchUnit = async () => {
  const response =await fetch(variables.REACT_APP_API + 'Unit',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchLots = async () => {
  const response = await fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const downloadExcel = (data, name) => {

  if (data.length > 0) {
    /* new worksheet from JS objects */
    var ws = XLSX.utils.json_to_sheet(data);

    /* new workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    /* write file */
    XLSX.writeFile(wb, `${name}.xlsx`);
  }
};

export const FetchBirdSaleList = async () => {
  const response =await fetch(variables.REACT_APP_API + 'BirdSale/GetBirdSale',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchCompanyDetails = async () => {
  const response =await fetch(variables.REACT_APP_API + 'CompanyDetails/GetCompanyDetails',
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


export const ReplaceNonNumeric=(numStr)=> {
  return String(numStr).replace(/[^0-9]/g, '')
}
export const Commarize=(numStr) =>{//
  return Number(ReplaceNonNumeric(numStr)).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
}

// new Intl.NumberFormat('en-IN', {
// }).format(finalAmount)

// var NUMBER2TEXT = {
//   ones: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
//   tens: ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
//   sep: ['', ' thousand ', ' million ', ' billion ', ' trillion ', ' quadrillion ', ' quintillion ', ' sextillion ']
// };

export const AmountInWords=(value)=>
{
  const ones= ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens= ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const sep= ['', ' thousand ', ' million ', ' billion ', ' trillion ', ' quadrillion ', ' quintillion ', ' sextillion '];
  var val = value,
  arr = [],
  str = '';
  let i = 0;

  if ( val.length === 0 ) {
    return;  
}

val = parseInt( val, 10 );
if ( isNaN( val ) ) {
    return;   
}

while ( val ) {
    arr.push( val % 1000 );
    val = parseInt( val / 1000, 10 );   
}

while ( arr.length ) {
  str = (function( a ) {
      var x = Math.floor( a / 100 ),
          y = Math.floor( a / 10 ) % 10,
          z = a % 10;
      
      return ( x > 0 ? ones[x] + ' hundred ' : '' ) +                 
             ( y >= 2 ? tens[y] + ' ' + ones[z] : ones[10*y + z] ); 
  })( arr.shift() ) + sep[i++] + str;                     
}

return str;
}


// (function( ones, tens, sep ) {

//   // var input = document.getElementById( 'input' ),
//   //     output = document.getElementById( 'output' );
  
//   //input.onkeyup = function() {
//       var val = this.value,
//           arr = [],
//           str = '',
//           i = 0;
      
//       if ( val.length === 0 ) {
//           output.textContent = 'Please type a number into the text-box.';
//           return;  
//       }
      
//       val = parseInt( val, 10 );
//       if ( isNaN( val ) ) {
//           output.textContent = 'Invalid input.';
//           return;   
//       }
      
//       while ( val ) {
//           arr.push( val % 1000 );
//           val = parseInt( val / 1000, 10 );   
//       }
      
//       while ( arr.length ) {
//           str = (function( a ) {
//               var x = Math.floor( a / 100 ),
//                   y = Math.floor( a / 10 ) % 10,
//                   z = a % 10;
              
//               return ( x > 0 ? ones[x] + ' hundred ' : '' ) +                 
//                      ( y >= 2 ? tens[y] + ' ' + ones[z] : ones[10*y + z] ); 
//           })( arr.shift() ) + sep[i++] + str;                     
//       }
      
//       output.textContent = str;        
//   //};
  
// })( NUMBER2TEXT.ones, NUMBER2TEXT.tens, NUMBER2TEXT.sep );

