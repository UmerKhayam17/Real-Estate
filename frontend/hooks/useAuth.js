// hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
   const [token, setToken] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const storedToken = localStorage.getItem('token');
         setToken(storedToken);
         setIsLoading(false);
      }
   }, []);

   const getToken = () => {
      if (typeof window !== 'undefined') {
         return localStorage.getItem('token');
      }
      return null;
   };

   const setAuthToken = (newToken) => {
      if (typeof window !== 'undefined') {
         localStorage.setItem('token', newToken);
         setToken(newToken);
      }
   };

   const removeAuthToken = () => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token');
         setToken(null);
      }
   };

   const isAuthenticated = () => {
      return !!getToken();
   };

   return {
      token,
      getToken,
      setAuthToken,
      removeAuthToken,
      isAuthenticated,
      isLoading
   };
};