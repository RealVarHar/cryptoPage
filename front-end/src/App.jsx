let Route=ReactRouterDOM.Route,Routes=ReactRouterDOM.Routes;
import { ThemeProvider } from './context/ThemeContext.jsx';
import CoinPage from './routes/CoinPage.jsx';
import Home from './routes/Home.jsx';
import Login from './routes/Login.jsx';
import Converter from './routes/Converter.jsx';


function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/converter' element={<Converter />} />
        <Route path='/coin/:coinId' element={<CoinPage />}>
          <Route path=':coinId' />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;