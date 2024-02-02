import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
import { Home } from './Home';
//import { Carton } from './Carton';
import CartonList from './Component/Carton/CartonList';
import LotListComponent from './Component/LotMaster/LotListComponent';
import NavComponent  from './Component/Nav/NavComponent';
import ChicksMasterComponent from './Component/Chicks/ChicksMasterComponent';
import LoginComponent from './Component/Login';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LotState from './Context/LotState';
import Alert from './Component/Alert/Alert';

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
      <LotState>
        <BrowserRouter>
        
          <div className="container">
            {/* <h3 className="m-3 d-flex justify-content-center">
              Welcome to Sanki Poultries Portal
            </h3> */}

            <NavComponent />
            <Alert alert={alert}/>
            <Routes>
              <Route path="/" element={<Home  showAlert={showAlert}/>} />
              <Route path="/carton" element={<CartonList  showAlert={showAlert}/>} />
              <Route path="/lotList" element={<LotListComponent  showAlert={showAlert}/>} />
              <Route path="/chicksmaster" element={<ChicksMasterComponent showAlert={showAlert}/>} />
              <Route path="/login" element={<LoginComponent showAlert={showAlert}/>} />
            </Routes>
          </div>
         
        </BrowserRouter>
      </LotState>
    </>
  );
}

export default App;
