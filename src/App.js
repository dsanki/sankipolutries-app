import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
import  Home  from './Home';
//import { Carton } from './Carton';
import CartonList from './Component/Carton/CartonList';
import LotListComponent from './Component/LotMaster/LotListComponent';
import NavComponent  from './Component/Nav/NavComponent';
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
import Medicine from './Component/Medicine/Medicine';
import CollapsibleExample from './Component/Nav/CollapsibleExample';
import RawMaterials from './Component/RawMaterials/RawMaterials'
import BirdSale from './Component/BirdSale/BirdSale'
import NavTest from './Component/Nav/NavTest'
import NavSticky from './Component/Nav/NavSticky'
import ChicksVaccinationTracker from './Component/Vaccination/ChicksVaccinationTracker'
function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type)=>{
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
      {/* <CommonState> */}
        <BrowserRouter>
        
          <div className="ContainerOverride">
            {/* <h3 className="m-3 d-flex justify-content-center">
              Welcome to Sanki Poultries Portal
            </h3> */}

            {/* <NavComponent /> */}
            {/* <CollapsibleExample/> */}
            <NavTest/>
{/* <NavSticky/> */}

            <Alert alert={alert}/>
            <Routes>
              <Route path="/" element={<Home  showAlert={showAlert}/>} />
              <Route path="/carton" element={<CartonList  showAlert={showAlert}/>} />
              <Route path="/lotList" element={<LotListComponent  showAlert={showAlert}/>} />
              <Route path="/chicksmaster" element={<ChicksMasterComponent showAlert={showAlert}/>} />
              <Route path="/clientlist" element={<ClientList showAlert={showAlert}/>} />
             
              <Route path="/shedlotmap" element={<ShedLotMap showAlert={showAlert}/>} />
              <Route path="/eggdailytracker" element={<EggDailyTracker showAlert={showAlert}/>} />
              <Route path="/mortalitylist" element={<MortalityList showAlert={showAlert}/>} />
              <Route path="/customerlist" element={<CustomerList showAlert={showAlert}/>} />
              <Route path="/eggsale" element={<EggSale showAlert={showAlert}/>} />
              <Route path="/eggsale/:id" element={<EggSale showAlert={showAlert}/>} />
              <Route path="/medicine" element={<Medicine showAlert={showAlert}/>} />
              <Route path="/rawmaterials" element={<RawMaterials showAlert={showAlert}/>} />
              <Route path="/birdsale" element={<BirdSale showAlert={showAlert}/>} />
              <Route path="/vaccinationtracker" element={<ChicksVaccinationTracker showAlert={showAlert}/>} />
              <Route path="/login" element={<LoginComponent showAlert={showAlert}/>} />
            </Routes>
          </div>
          
         
        </BrowserRouter>
      {/* </CommonState> */}
    </>
  );
}

export default App;
