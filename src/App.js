import logo from './logo.svg';
import './App.css';
import React, { useState, Component, Fragment } from 'react'
import Home from './Home';

 import NavComponent from './Component/Nav/NavComponent';
  import ChicksMasterComponent from './Component/Chicks/ChicksMasterComponent';
import LoginComponent from './Component/Login';
 import ClientList from './Component/Client/ClientList'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import CommonState from './Context/CommonState';
import Alert from './Component/Alert/Alert';
 import ShedLotMap from './Component/Chicks/ShedLotMap';
import EggDailyTracker from './Component/EggDailyTracker/EggDailyTracker';
import CartonList from './Component/Carton/CartonList';
 import LotListComponent from './Component/LotMaster/LotListComponent';
 import MortalityList from './Component/Chicks/MortalityList'
 import CustomerList from './Component/Customer/CustomerList'
 import EggSale from './Component/EggSale/EggSale';
 import EggSaleModule from './Component/EggSale/EggSaleModule';
 import EggSaleInvoiceList from './Component/EggSale/EggSaleInvoiceList';
 import EggSalePaymentIn from './Component/EggSale/EggSalePaymentIn';
 import Medicine from './Component/Medicine/Medicine';
// import CollapsibleExample from './Component/Nav/CollapsibleExample';
 import RawMaterials from './Component/RawMaterials/RawMaterials'
 import BirdSale from './Component/BirdSale/BirdSale'
import Navigation from './Component/Nav/Navigation'
// import NavSticky from './Component/Nav/NavSticky'
// import ChicksVaccinationTracker from './Component/Vaccination/ChicksVaccinationTracker'
// import ReactDOM from 'react-dom';
// import Invoice from './Component/Invoice/Invoice';
// import InvoiceData from './data/InvoiceData'
// import EggSaleInvoice from './Component/EggSale/EggSaleInvoice'
// import Stock from './Component/Stock/Stock';
function App() {

       console.log("Local-"+process.env.REACT_APP_API)
      //  console.log("development-"+process.env.development.REACT_APP_API)
      //  console.log("test-"+process.env.test.REACT_APP_API)
      //  console.log("production-"+process.env.production.REACT_APP_API)

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  }

  return (

    <>

      <div>
       {
      

       }

      </div>


      {/* <Fragment>
        <PDFViewer width="1000" height="600" className="app" >

          <Invoice invoice={InvoiceData} />
        </PDFViewer>
      </Fragment> */}
      {/* <CommonState> */}
      <BrowserRouter>

        <div className="ContainerOverride">
          {/* <h3 className="m-3 d-flex justify-content-center">
              Welcome to Sanki Poultries Portal
            </h3> */}

          {/* <NavComponent /> */}
          {/* <CollapsibleExample/> */}
          <Navigation />
          {/* <NavSticky/> */}

          <Alert alert={alert} />
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} />} />
            {/* <Route path="/carton" element={<CartonList showAlert={showAlert} />} />
            
            
           
           
            
            
           
            <Route path="/rawmaterials" element={<RawMaterials showAlert={showAlert} />} />
            
            <Route path="/vaccinationtracker" element={<ChicksVaccinationTracker showAlert={showAlert} />} />
            
            <Route path="/stock" element={<Stock showAlert={showAlert} />} /> */}

<Route path="/medicine" element={<Medicine showAlert={showAlert} />} />
 <Route path="/carton" element={<CartonList showAlert={showAlert} />} />
<Route path="/lotList" element={<LotListComponent showAlert={showAlert} />} />
<Route path="/chicksmaster" element={<ChicksMasterComponent showAlert={showAlert} />} />
            <Route path="/birdsale" element={<BirdSale showAlert={showAlert} />} />
            <Route path="/birdsale/:uid" element={<BirdSale showAlert={showAlert} />} />
            <Route path="/birdsale/?:uid" element={<BirdSale showAlert={showAlert} />} />
            <Route path="/customerlist" element={<CustomerList showAlert={showAlert} />} />
            <Route path="/eggsale" element={<EggSale showAlert={showAlert} />} />
            <Route path="/eggsale/:uid" element={<EggSale showAlert={showAlert} />} />
            <Route path="/eggsalemodule/:uid/:invid" element={<EggSaleModule showAlert={showAlert} />} />
            <Route path="/eggsalemodule/:uid" element={<EggSaleModule showAlert={showAlert} />} />
            <Route path="/login" element={<LoginComponent showAlert={showAlert} />} />
            <Route path="/eggdailytracker" element={<EggDailyTracker showAlert={showAlert} />} />
            <Route path="/eggsaleinvoicelist" element={<EggSaleInvoiceList showAlert={showAlert} />} />
            <Route path="/eggsalepaymentin" element={<EggSalePaymentIn showAlert={showAlert} />} />
            <Route path="/eggsaleinvoicelist/:dayscount" element={<EggSaleInvoiceList showAlert={showAlert} />} />
            <Route path="/eggsalepaymentin/:uid" element={<EggSalePaymentIn showAlert={showAlert} />} />
            <Route path="/eggsalepaymentin/?:uid" element={<EggSalePaymentIn showAlert={showAlert} />} />
            <Route path="/clientlist" element={<ClientList showAlert={showAlert} />} />
            
            <Route path="/shedlotmap" element={<ShedLotMap showAlert={showAlert} />} />
            <Route path="/mortalitylist" element={<MortalityList showAlert={showAlert} />} />
            <Route path="/rawmaterials" element={<RawMaterials showAlert={showAlert} />} />
          </Routes>
        </div>


      </BrowserRouter>
      {/* </CommonState> */}
    </>
  );
}

export default App;
