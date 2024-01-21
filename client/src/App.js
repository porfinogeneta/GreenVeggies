// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
// views
import Home from './views/Home';
import About from './views/About';
import ShoppingCart from './views/ShoppingCart';
import Login from './views/Login';
// private routing components
import PrivateRoutes from './components/PrivateRoutes';

// firebase
import './config/firebase-config'
import './App.css'

function App() {
  return (
    <Router>
      <Container>
        <Navbar bg="dark" variant="dark" fixed="top">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link">
              Login
            </Nav.Link>
          </Nav>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} />
          <Route element={<PrivateRoutes/>}>
            <Route path="/shoppingcart" element={<ShoppingCart/>}/>
          </Route>
          <Route element={<Login/>} path="/login"/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;