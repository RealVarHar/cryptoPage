import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CoinPage from './routes/CoinPage';
import Home from './routes/Home';
import Login from './routes/Login';
import Calculator from './routes/Calculator';


function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/calculator' element={<Calculator />} />
        <Route path='/coin/:coinId' element={<CoinPage />}>
          <Route path=':coinId' />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
