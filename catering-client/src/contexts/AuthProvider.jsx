/* eslint-disable react/prop-types */
import React from 'react';
import {
  FacebookLoginClient,
  InitParams,
} from "@greatsumini/react-facebook-login";
import { createContext } from 'react';
import { GoogleAuthProvider, RecaptchaVerifier, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import app from '../firebase/firebase.config';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
console.log('Firebase Auth initialized:', auth);
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signUpWithGmail = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const signUpWithFacebook = () => {
        return new Promise((resolve, reject) => {
          FacebookLoginClient.login((response) => {
            if (response.authResponse) {
              FacebookLoginClient.getProfile((profile) => {
                resolve(profile);
              });
            } else {
              reject("Facebook login failed");
            }
          });
        });
      };
    
      useEffect(() => {
        const initParams = {
          appId: "1294790831529557", // Replace with your Facebook App ID
          version: "v12.0",
        };
    
        FacebookLoginClient.init(initParams);
    
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            const userInfo = { email: currentUser.email };
            axios.post(`${BASE_URL}/jwt`, userInfo).then((response) => {
              if (response.data.token) {
                localStorage.setItem("access-token", response.data.token);
              }
            });
          } else {
            localStorage.removeItem("access-token");
          }
          setLoading(false);
        });
    
        return () => unsubscribe();
      }, []);
    const login = (email, password) =>{
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () =>{
        localStorage.removeItem('genius-token');
        return signOut(auth);
    }

    const updateUserProfile = (name, photoURL) => {
        // Make sure photoURL is a valid string or null
        if (photoURL && typeof photoURL !== 'string') {
          console.error('Invalid photoURL: Must be a string');
          return;
        }
      
        return updateProfile(auth.currentUser, {
          displayName: name || auth.currentUser.displayName, 
          photoURL: photoURL || auth.currentUser.photoURL
        });
      };

      
      useEffect( () =>{
        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            // console.log(currentUser);
            setUser(currentUser);
            if(currentUser){
                const userInfo ={email: currentUser.email}
                axios.post(`${BASE_URL}/jwt`, userInfo)
                  .then( (response) => {
                    // console.log(response.data.token);
                    if(response.data.token){    
                        localStorage.setItem("access-token", response.data.token)
                    }
                  })
            } else{
               localStorage.removeItem("access-token")
            }
           
            setLoading(false);
        });

        return () =>{
            return unsubscribe();
        }
    }, [])

    const authInfo = {
        user, 
        loading,
        createUser, 
        login, 
        logOut,
        signUpWithGmail,
        signUpWithFacebook,
        updateUserProfile,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;