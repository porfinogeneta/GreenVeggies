import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
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

// firebase
import './config/firebase-config'
import './App.css'


function App() {
  const { auth, role, loading, error } = useAuth('user');

  console.log("Auth Object:", auth);
  console.log("Role:", role);
  
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
            {auth ? (
              <>
                <Nav.Link as={Link} to="/profile" className="nav-link">
                  Profile
                </Nav.Link>
                {/* Change to farmer later */}
                {role === 'user' && (
                  <Nav.Link as={Link} to="/farmer" className="nav-link">
                    Farmer
                  </Nav.Link>
                )}
                {/* Change to admin later */}
                {role === 'user' && (
                  <Nav.Link as={Link} to="/admin" className="nav-link">
                    Admin
                  </Nav.Link>
                )}
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="nav-link">
                Login
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/shoppingcart" className="nav-link">
              Cart
            </Nav.Link>
          </Nav>
        </Navbar>

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
