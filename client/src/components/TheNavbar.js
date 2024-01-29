import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import useAuthorizeGET from '../hooks/useAuthorizeGET';
import Cookies from 'js-cookie';
import { getAuth, signOut } from 'firebase/auth';
import '../components/styles/the_navbar_styles.css';

function TheNavbar() {
  const { loading, error, fetchData } = useAuthorizeGET();
  const [user, setUser] = useState();
  const [isVisible, setIsVisible] = useState(true); // Initially set to true so that the Navbar is visible


  useEffect(() => {
    // manage visible fields
    const getCurrentRole = async () => {
      if (uid) {
        console.log(uid);
        const response = await fetchData('USER', `http://localhost:8001/user/role/${uid}`);
        setUser(response);
      } else {
        setUser(null);
      }
    };
    getCurrentRole();

    // Add scroll event listener to determine when to show the Navbar
    const handleScroll = () => {
      const scrolledToTop = window.scrollY === 0;
      setIsVisible(scrolledToTop);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [uid]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // reset cookies
        Cookies.set('accessToken', null);
        Cookies.set('authorizeToken', null);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        fixed="top"
        style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? '0' : '-100%'})`, transition: 'opacity 0.5s, transform 0.5s' }}
      >
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-link">
            Home
          </Nav.Link>
          {user ? (
            <>
              {(user.role === 'FARMER' || user.role == 'ADMIN') && (
                <Nav.Link as={Link} to="/farmer" className="nav-link">
                  Farmer
                </Nav.Link>
              )}
              {user.role === 'ADMIN' && (
                <Nav.Link as={Link} to="/admin" className="nav-link">
                  Admin
                </Nav.Link>
              )}
              <Nav.Link as={Link} to="/shoppingcart" className="nav-link">
                Cart
              </Nav.Link>
              <button className="logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              {user == null && (
                <Nav.Link as={Link} to="/login" className="nav-link">
                  Login
                </Nav.Link>
              )}
            </>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}

export default TheNavbar;
