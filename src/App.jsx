import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Registration from './components/Registration';
import Login from './components/Login';
import Businput from './components/Businput';
import Buses from './components/Buses';
import Seats from './components/Seats';
import Mybookings from './components/Mybookings';
import Resetpass from './components/Resetpass';
import Paymentprocess from './components/Paymentprocess';
import Carddetails from './components/Carddetails';

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <>
      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            <Businput
              onLoginClick={() => setOpenLogin(true)}
            />
          }
        />
        <Route path="/buses" element={<Buses />} />
        <Route path="/bus/:id/seats" element={<Seats />} />
        <Route path="/mybookings" element={<Mybookings />} />
        <Route path="/editpass" element={<Resetpass />} />
        <Route path="/bus/:id/journeydetails" element={<Paymentprocess />} />
        <Route path="/bus/:id/journeydetails/payment" element={<Carddetails />} />
      </Routes>


      {openLogin && (
        <Login
          onClose={() => setOpenLogin(false)}
          openRegister={() => {
            setOpenLogin(false);
            setOpenRegister(true);
          }}
        />
      )}

      {openRegister && (
        <Registration
          onClose={() => setOpenRegister(false)}
          openLogin={() => {
            setOpenRegister(false);
            setOpenLogin(true);
          }}
        />
      )}
    </>
  );
}

export default App;