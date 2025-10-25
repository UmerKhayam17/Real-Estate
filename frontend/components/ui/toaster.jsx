// components/ui/toaster.jsx
"use client";

import { useToast } from './use-toast';
import { Toast } from './toast';

export function Toaster() {
   const { toasts, dismiss } = useToast();

   if (toasts.length === 0) return null;

   return (
      <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
         {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
         ))}
      </div>
   );
}