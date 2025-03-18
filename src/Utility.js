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

export const CalculateNoOfDaysUpdated = (fromdate,todate) => {
  var a = moment(new Date(todate), 'DD-MM-YYYY');
  var b = moment(new Date(fromdate), 'DD-MM-YYYY');
  let days = a.diff(b, 'days');
  return days;
};

export const CalculateAgeInWeeksUpdated = (fromdate, todate) => {

  var a = moment(new Date(todate), 'DD-MM-YYYY');
  var b = moment(new Date(fromdate), 'DD-MM-YYYY');
  var diff = moment.duration(a.diff(b));

  var _week=Math.floor(diff.asWeeks());
  var n=diff.asWeeks();
  var result = (n - Math. floor(n)) !== 0;

if(result)
{
  _week=_week+1;
}
  return _week;
};



export const CalculateAgeInWeeks = (date) => {

  var a = moment(new Date(), 'DD-MM-YYYY');
  var b = moment(new Date(date), 'DD-MM-YYYY');
  var diff = moment.duration(a.diff(b));

  var _week=Math.floor(diff.asWeeks());
  var n=diff.asWeeks();
  var result = (n - Math. floor(n)) !== 0;

if(result)
{
  _week=_week+1;
}
  return _week;
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

export const FetchMortalityList = async (apiurl) => {

  const response = await fetch(apiurl + 'Mortality/GetMortalityShedLotMapList?CompanyId='
    +localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json()

  return data;
}

export const FetchPaymentMode = async (apiurl) => {
  const response = await fetch(apiurl + 'PaymentMode/GetPaymentMode',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchShedsList = async (apiurl) => {
  const response = await fetch(apiurl + 'ChicksMaster/GetShedList?CompanyId='
    +localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchShedLotMapList = async (apiurl) => {
  const response = await fetch(apiurl + 'ChicksMaster/GetShedLotMapList?CompanyId='
    +localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}




export const FetchChicks = async (companyid,apiurl) => {
  const response = await fetch(apiurl + 'ChicksMaster/GetChicksByCompanyId?CompanyId='+companyid,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchLotById = async (id,apiurl) => {
  const response =await fetch(process.env.REACT_APP_API + 'ChicksMaster/' + id,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchUnit = async (apiurl) => {
  const response =await fetch(process.env.REACT_APP_API + 'Unit',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}



export const FetchFeed = async (apiurl) => {
  const response = await fetch(apiurl + 'Feed/GetFeedListByCompanyId?CompanyId='
    +localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchLots = async (apiurl) => {
  const response = await fetch(apiurl + 'ChicksMaster/GetLots?CompanyId='
    +localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const downloadExcelFilter = (data, name,compname,fromdate,todate) => {

  if (data.length > 0) {
    /* new worksheet from JS objects */
    var ws = XLSX.utils.json_to_sheet(data,{origin:3});

    /* new workbook */
    var wb = XLSX.utils.book_new();

    XLSX.utils.sheet_add_aoa(
      ws,
      [[compname]],
      { origin: 0 }
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['From: '+ fromdate]],
      { origin: 1 }
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Todate: '+ todate]],
      { origin: 2 }
    );

    XLSX.utils.book_append_sheet(wb, ws, name);
    /* write file */
    XLSX.writeFile(wb, `${name}.xlsx`);
  }
};


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

export const FetchGunnyBagSaleList = async (uid,id,apiurl) => {
  const response = await fetch(apiurl + 'GunnyBagSale/GetGunnyBagSale?uid='
    +uid +'&id='+id +'&CompanyId='+localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

  const data = await response.json();
  return data;
}

export const FetchBirdSaleList = async (uid,id,apiurl) => {
  let url= apiurl + 'BirdSale/GetBirdSale?CompanyId='+localStorage.getItem('companyid');

if(uid!=null)
{
 url= apiurl + 'BirdSale/GetBirdSale?uid='
  +uid +'&CompanyId='+localStorage.getItem('companyid')
}



  const response =await fetch(url,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FetchCompanyDetails = async (apiurl) => {
  const response =await fetch(apiurl + 'CompanyDetails/GetCompanyDetailsByCompanyId',
    {
      method: 'GET',
      // headers: {
      //  // 'Access-Control-Allow-Origin':'http://localhost:16619',
      //  // 'Authorization': localStorage.getItem('token')
      // }
    });
  const data = await response.json();
  return data;
}

export const FecthEggCategory = async (apiurl) => {
  const response =await fetch(apiurl + 'EggSale/GetEggCategory',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}


export const FectAllEggSaleInvoiceList = async (fromdate,todate, apiurl) => {
  const response =await fetch(apiurl + 'EggSale/GetAllEggSaleInvoiceList?fromdate='
    +fromdate +'&todate='+todate +'&CompanyId='+localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
        //'Access-Control-Allow-Origin':'http://spapi.local:85'
       // 'Access-Control-Allow-Credentials':'true'
      }
    });
  const data = await response.json();
  return data;
}

export const FecthEggSaleInvoiceList = async (custid, apiurl) => {
  const response =await fetch(apiurl + 'EggSale/GetEggSaleInvoiceList?CustId='
    +custid+'&CompanyId='+localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FecthEggStockInventory = async (apiurl) => {
  const response =await fetch(apiurl + 'EggStockInventory/GetEggStockInventoryCompanyId?CompanyId='+localStorage.getItem('companyid'),
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FecthEggSaleInvoiceById = async (id, apiurl) => {
  const response =await fetch(apiurl + 'EggSale/GetEggSaleInvoiceById?id='+id,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FecthStockListById = async (catid, apiurl) => {

  const response =await fetch(apiurl + 'Stock/GetStockList?category='+catid,
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const FecthBirdType = async (apiurl) => {
  const response =await fetch(apiurl + 'BirdSale/GetBirdType',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const GetCustomerByTypeId = async (custtypeid, apiurl) => {
  // let url=apiurl + 'Customer/GetCustomerByTypeId';
  // if(custtypeid!=null)
  // {
  //   url=apiurl + 'Customer/GetCustomerByTypeId?customerTypeId='+custtypeid;
  // }
    
    const response =await fetch(apiurl + 'Customer/GetCustomerByTypeId?customerTypeId='+custtypeid,
      {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
  
  const data = await response.json();
  return data;
}

export const GetGunnybagTypeList = async (apiurl) => {
  const response =await fetch(apiurl + 'GunnyBagSale/GetGunnybagTypeMaster',
    {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
  const data = await response.json();
  return data;
}

export const ReplaceNonNumeric=(numStr)=> {
  return String(numStr).replace(/[^0-9]/g, '')
}
export const Commarize=(numStr) =>{//
  return Number(ReplaceNonNumeric(numStr)).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
}


const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

const zero = "Zero";
const arab = "Arab";
const crore = "Crore";
const lakh = "Lakh";
const thousand = "Thousand";
const hundred = "Hundred";
const currency = "Rupees";
const paisa = "Paisa";
const only = "Only";

export const ConvertNumberToWords =(amount)=> {
  if (amount === 0) return `${zero} ${currency} ${only}`;
  
  function convert(num) {
    let parts = [];
    if (num >= 1e9) {
      parts.push(`${convert(Math.floor(num / 1e9))} ${arab}`);
      num %= 1e9;
    }
    if (num >= 1e7) {
      parts.push(`${convert(Math.floor(num / 1e7))} ${crore}`);
      num %= 1e7;
    }
    if (num >= 1e5) {
      parts.push(`${convert(Math.floor(num / 1e5))} ${lakh}`);
      num %= 1e5;
    }
    if (num >= 1000) {
      parts.push(`${convert(Math.floor(num / 1000))} ${thousand}`);
      num %= 1000;
    }
    if (num >= 100) {
      parts.push(`${convert(Math.floor(num / 100))} ${hundred}`);
      num %= 100;
    }
    if (num >= 20) {
      parts.push(`${tens[Math.floor(num / 10)]}`);
      if (num % 10 > 0) parts.push(units[num % 10]);
    } else if (num >= 10) {
      parts.push(`${teens[num - 10]}`);
    } else if (num > 0) {
      parts.push(`${units[num]}`);
    }
    return parts.join(" ");
  }

  let integerPart = Math.floor(amount);
  let wholeWordPart = convert(integerPart);
  let result = wholeWordPart ? `${wholeWordPart} ${currency}` : '';

  let decimalPart = Math.round((amount - integerPart) * 100);
  if (decimalPart > 0) {
    if (wholeWordPart) {
      result += " and ";
    }
    result += `${convert(decimalPart)} ${paisa}`;
  }

  return `${result} ${only}`;
}

export const FetchEggDiscountTypes=()=>{

  const eggdistype =[
        {
            "Id": 1,
            "Name": "Per Egg"
        },
        {
           "Id": 2,
            "Name": "%"
      }
      ]

      return eggdistype;
}


export const AmountInWords=(value)=>
{
  const ones= ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens= ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  //const sep= ['', ' thousand ', ' million ', ' billion ', ' trillion ', ' quadrillion ', ' quintillion ', ' sextillion '];

  const sep= ['', ' thousand ', ' Lakh ', ' Crore ', ' Arab ', ' quadrillion ', ' quintillion ', ' sextillion '];
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

export const FetchAdvanceListByCustId = async (custid) => {
  const response =await fetch(process.env.REACT_APP_API 
    + 'AdvancePayment/GetAdvancePaymentListByCustId?CustomerId=' +
      custid + '&CompanyId=' + localStorage.getItem('companyid'),
      {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token')
          }
      });
      const data = await response.json();
      return data;
}

