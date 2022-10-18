import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CoinPage from './routes/CoinPage';
import Home from './routes/Home';
import Login from './routes/Login';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/coin/:coinId' element={<CoinPage />}>
        <Route path=':coinId' />
      </Route>
    </Routes>
  );
}

export default App;
