import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

// from what route we came
const useAuth = (routeType) => {
  const [auth, setAuth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    const accessToken = Cookies.get('accessToken');
    const uid = Cookies.get('authorizeToken');

    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'uid': 'UID ' + uid,
          'Role': 'Role: ' + routeType // role changing
        },
      };

      const response = await fetch('http://localhost:8001/authenticate', options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAuth(true);
    } catch (error) {
      setError(error.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

  return { auth, loading, error };
};

export default useAuth;