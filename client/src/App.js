import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
// views
import Home from './views/Home';
import About from './views/About';
import ShoppingCart from './views/ShoppingCart';
import Login from './views/Login';
import Admin from './views/Admin';
import Farmer from './views/Farmer';
import Profile from './views/Profile';
// private routing components
// import PrivateRoutes from './components/PrivateRoutes';
import PrivateRoutes from './components/PrivateRoutes';
import useAuth from './hooks/useAuth';
import TheNavbar from './components/TheNavbar';
// firebase
import './config/firebase-config'
import './App.css'


function App() {  
  return (
    <Router>
      <Container>
        <TheNavbar/>

        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} />
          {/* protected routes */}
          <Route element={<PrivateRoutes role='user'/>}>
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<PrivateRoutes role='farmer'/>}>
            <Route path='/farmer' element={<Farmer/>} exact></Route>
          </Route>

          <Route element={<PrivateRoutes role='admin'/>}>
            <Route path='/admin' element={<Admin/>} exact></Route>
          </Route>
          
          <Route element={<Login/>} path="/login"/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
