// components/ui/use-toast.js
"use client";

import { useState } from 'react';

export const useToast = () => {
   const [toasts, setToasts] = useState([]);

   const toast = ({ title, description, variant = 'default' }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
         id,
         title,
         description,
         variant,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after 5 seconds
      setTimeout(() => {
         setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);

      return id;
   };

   const dismiss = (id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   };

   return {
      toast,
      dismiss,
      toasts,
   };
};