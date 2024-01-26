import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import '../views/styles/profile_styles.css'

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const { auth, role, loading, error } = useAuth('user');

  return (
    <div>
      {user ? (
        <div>
          <h1>Profile</h1>
          <ul className="user-details">
            <li className="detail-item">𝗟𝗼𝗴𝗴𝗲𝗱 𝗶𝗻: {auth.toString()}</li>
            <li className="detail-item">𝗥𝗼𝗹𝗲: {role}</li>
            <li className="detail-item">𝗡𝗮𝗺𝗲: {user.displayName}</li>
            <li className="detail-item">𝗘𝗺𝗮𝗶𝗹: {user.email}</li>
          </ul>
        </div>
      ) : (
        <p className="loading-message">Loading user profile...</p>
      )}
    </div>
  );
}

export default Profile;
