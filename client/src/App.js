// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
// views
import Home from './views/Home';
import About from './views/About';
import ShoppingCart from './views/ShoppingCart';
import Login from './views/Login';
import Admin from './views/Admin';
import Farmer from './views/Farmer';
// private routing components
// import PrivateRoutes from './components/PrivateRoutes';
import PrivateRoutes from './components/PrivateRoutes';

// firebase
import './config/firebase-config'



function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} />
          {/* protected routes */}
          <Route element={<PrivateRoutes role='user'/>}>
            <Route path="/shoppingcart" element={<ShoppingCart />} />
          </Route>

          <Route element={<PrivateRoutes role='farmer'/>}>
            <Route element={<Farmer/>} path='/farmer' exact></Route>
          </Route>

          <Route element={<PrivateRoutes role='admin'/>}>
            <Route element={<Admin/>} path='/admin' exact></Route>
          </Route>
          
          <Route element={<Login/>} path="/login"/>
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
