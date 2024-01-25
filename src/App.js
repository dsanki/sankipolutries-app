import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {Carton} from './Carton';
import LotListComponent from './Component/LotMaster/LotListComponent';
import {Navigation} from './Navigation';
import ChicksMasterComponent from './Component/Chicks/ChicksMasterComponent';


import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
     <div className="container">
     <h3 className="m-3 d-flex justify-content-center">
       Welcome to Sanki Poultries Portal
     </h3>

     <Navigation/>

     <Routes>
     <Route path="/" element={<Home />} />
       <Route path="/carton" element={<Carton />} />
       <Route path="/lotList" element={<LotListComponent />} />
       <Route path="/chicksmaster" element={<ChicksMasterComponent />} />
     </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
