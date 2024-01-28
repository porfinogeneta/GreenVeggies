import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Footer from './components/Footer';
// views
import Home from './views/Home';
import ShoppingCart from './views/ShoppingCart';
import Login from './views/Login';
import Admin from './views/Admin';
import Farmer from './views/Farmer';
// private routing components
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
        <Routes>
          <Route path="/" element={<Home />} exact />
          {/* protected routes */}
          <Route element={<PrivateRoutes role='user'/>}>
            <Route path="/shoppingcart" element={<ShoppingCart />} />
          </Route>

          <Route element={<PrivateRoutes role='farmer'/>}>
            <Route path='/farmer' element={<Farmer/>} exact></Route>
          </Route>

          <Route element={<PrivateRoutes role='admin'/>}>
            <Route path='/admin' element={<Admin/>} exact></Route>
          </Route>
          
          <Route element={<Login/>} path="/login"/>
        </Routes>
        <Footer />
      </Container>
    </Router>
  );
}

export default App;
