import logo from './logo.svg';
import './App.css';
import React, { useState, Component, Fragment } from 'react'
import Home from './Home';
//import { Carton } from './Carton';
import CartonList from './Component/Carton/CartonList';
import LotListComponent from './Component/LotMaster/LotListComponent';
import NavComponent from './Component/Nav/NavComponent';
import ChicksMasterComponent from './Component/Chicks/ChicksMasterComponent';
import LoginComponent from './Component/Login';
import ClientList from './Component/Client/ClientList'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CommonState from './Context/CommonState';
import Alert from './Component/Alert/Alert';
import ShedLotMap from './Component/Chicks/ShedLotMap';
import EggDailyTracker from './Component/EggDailyTracker/EggDailyTracker';
import MortalityList from './Component/Chicks/MortalityList'
import CustomerList from './Component/Customer/CustomerList'
import EggSale from './Component/EggSale/EggSale';
import EggSaleModule from './Component/EggSale/EggSaleModule';
import Medicine from './Component/Medicine/Medicine';
import CollapsibleExample from './Component/Nav/CollapsibleExample';
import RawMaterials from './Component/RawMaterials/RawMaterials'
import BirdSale from './Component/BirdSale/BirdSale'
import NavTest from './Component/Nav/NavTest'
import NavSticky from './Component/Nav/NavSticky'
import ChicksVaccinationTracker from './Component/Vaccination/ChicksVaccinationTracker'
import ReactDOM from 'react-dom';
// import { PDFViewer } from '@react-pdf/renderer';
import Invoice from './Component/Invoice/Invoice';
import InvoiceData from './data/InvoiceData'
import EggSaleInvoice from './Component/EggSale/EggSaleInvoice'
import Stock from './Component/Stock/Stock';
function App() {



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
          console.log(InvoiceData)
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
          <NavTest />
          {/* <NavSticky/> */}

          <Alert alert={alert} />
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} />} />
            <Route path="/carton" element={<CartonList showAlert={showAlert} />} />
            <Route path="/lotList" element={<LotListComponent showAlert={showAlert} />} />
            <Route path="/chicksmaster" element={<ChicksMasterComponent showAlert={showAlert} />} />
            <Route path="/clientlist" element={<ClientList showAlert={showAlert} />} />

            <Route path="/shedlotmap" element={<ShedLotMap showAlert={showAlert} />} />
            <Route path="/eggdailytracker" element={<EggDailyTracker showAlert={showAlert} />} />
            <Route path="/mortalitylist" element={<MortalityList showAlert={showAlert} />} />
            <Route path="/customerlist" element={<CustomerList showAlert={showAlert} />} />
            {/* <Route path="/eggsale" element={<EggSale showAlert={showAlert} />} /> */}
            {/* <Route path="/eggsale/:uid" element={<EggSale showAlert={showAlert} />} />
            <Route path="/eggsalemodule/:uid?/:invid?" element={<EggSaleModule showAlert={showAlert} />} /> */}
            {/* <Route path="/eggsalemodule/:invid" element={<EggSaleModule showAlert={showAlert} />} /> */}
            <Route path="/medicine" element={<Medicine showAlert={showAlert} />} />
            <Route path="/rawmaterials" element={<RawMaterials showAlert={showAlert} />} />
            <Route path="/birdsale" element={<BirdSale showAlert={showAlert} />} />
            <Route path="/vaccinationtracker" element={<ChicksVaccinationTracker showAlert={showAlert} />} />
            <Route path="/login" element={<LoginComponent showAlert={showAlert} />} />
            {/* <Route path="/eggsaleinvoice/:id" element={<EggSaleInvoice showAlert={showAlert} />} /> */}
            <Route path="/eggsale" element={<EggSale showAlert={showAlert} />} />
            <Route path="/eggsale/:uid" element={<EggSale showAlert={showAlert} />} />
            <Route path="/eggsalemodule/:uid/:invid" element={<EggSaleModule showAlert={showAlert} />} />
            <Route path="/eggsalemodule/:uid" element={<EggSaleModule showAlert={showAlert} />} />
            <Route path="/stock" element={<Stock showAlert={showAlert} />} />
          </Routes>
        </div>


      </BrowserRouter>
      {/* </CommonState> */}
    </>
  );
}

export default App;
