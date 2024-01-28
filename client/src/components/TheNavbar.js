import React, { useEffect, useState } from 'react';
import '../views/styles/about_styles.css';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import useAuthorizeGET from '../hooks/useAuthorizeGET';
import Cookies from 'js-cookie'
import { getAuth, signOut } from "firebase/auth";

function TheNavbar() {
    const {loading, error, fetchData} = useAuthorizeGET()
    const [user, setUser] = useState()
    // cookies
    let uid = Cookies.get('authorizeToken');
    let accessToken = Cookies.get('accessToken');

    useEffect(() => {
        // manage visible fields
        const getCurrentRole = async () => {
            if (uid){
                console.log(uid);
                const response = await fetchData('USER', `http://localhost:8001/user/role/${uid}`)
                setUser(response)
            }else {
                setUser(null)
            }
        }
        getCurrentRole()
    }, [uid])


    const handleLogout = () => {
        const auth = getAuth();
            signOut(auth).then(() => {
                // reset cookies
                Cookies.set('accessToken', null);
                Cookies.set('authorizeToken',null)
                uid = Cookies.get('authorizeToken');
                window.location.reload();
            }).catch((error) => {
                console.log(error);
            });
    }


    return <div>
        <Navbar bg="dark" variant="dark" fixed="top">
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/" className="nav-link">
                Home
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="nav-link">
                About
                </Nav.Link>
                {user ? (
                <>
                    <Nav.Link as={Link} to="/profile" className="nav-link">
                    Profile
                    </Nav.Link>
                    {/* Change to farmer later */}
                    {user.role === 'USER' && (
                    <Nav.Link as={Link} to="/farmer" className="nav-link">
                        Farmer
                    </Nav.Link>
                    )}
                    {/* Change to admin later */}
                    {user.role === 'ADMIN' && (
                    <Nav.Link as={Link} to="/admin" className="nav-link">
                        Admin
                    </Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/shoppingcart" className="nav-link">
                        Cart
                    </Nav.Link>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
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
    </div>;
}

export default TheNavbar;





