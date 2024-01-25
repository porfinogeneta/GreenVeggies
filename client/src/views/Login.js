import React from 'react';
import Cookies from 'js-cookie';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";



const loginWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            // console.log(user);
            // cookie z tokenem do autentykacji
            Cookies.set('accessToken', user.accessToken, { secure: true, sameSite: 'strict' });
            // cookie z uid do autoryzacji
            Cookies.set('authorizeToken', user.uid, { secure: true, sameSite: 'strict' })
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}


function Login() {
  return <div>
    <button onClick={loginWithGoogle}>Login</button>
  </div>;
}

export default Login;