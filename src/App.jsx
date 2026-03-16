import React from 'react';
import Registration from './components/Registration';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Businput from './components/Businput';
import Buses from './components/Buses';
import Seats from './components/Seats';
import Mybookings from './components/Mybookings'
import Resetpass from './components/Resetpass';
import Paymentprocess from './components/Paymentprocess';
// import Profile from './components/Profile';

function App() {
  return (

    <Routes>
      <Route path="/registration" element={<Registration />} />
      <Route path="/" element={<Login />} />
      <Route path="/businput" element={<Businput />} />
      <Route path="/buses" element={<Buses />} />
      <Route path="/bus/:id/seats" element={<Seats />} />
      <Route path="/mybookings" element={<Mybookings/>}/>
      <Route path="/editpass" element={<Resetpass/>}/>
      <Route path="/journeydetails" element={<Paymentprocess/>}/>

    </Routes>
  );
}

export default App;