// components/ui/toast.jsx
"use client";

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Toast = ({ toast, onDismiss }) => {
   useEffect(() => {
      const timer = setTimeout(() => {
         onDismiss(toast.id);
      }, 5000);

      return () => clearTimeout(timer);
   }, [toast.id, onDismiss]);

   const icons = {
      default: <Info className="h-4 w-4" />,
      destructive: <XCircle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
   };

   const variants = {
      default: "border bg-background text-foreground",
      destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      success: "border-green-500 bg-green-50 text-green-900",
      warning: "border-yellow-500 bg-yellow-50 text-yellow-900",
   };

   return (
      <div
         className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
            variants[toast.variant]
         )}
      >
         <div className="flex items-center space-x-3">
            <div className={cn(
               "flex-shrink-0",
               toast.variant === 'destructive' && "text-destructive-foreground",
               toast.variant === 'success' && "text-green-600",
               toast.variant === 'warning' && "text-yellow-600"
            )}>
               {icons[toast.variant]}
            </div>
            <div className="grid gap-1">
               {toast.title && (
                  <div className={cn(
                     "text-sm font-semibold",
                     toast.variant === 'destructive' && "text-destructive-foreground"
                  )}>
                     {toast.title}
                  </div>
               )}
               {toast.description && (
                  <div className={cn(
                     "text-sm opacity-90",
                     toast.variant === 'destructive' && "text-destructive-foreground"
                  )}>
                     {toast.description}
                  </div>
               )}
            </div>
         </div>
         <button
            className={cn(
               "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
               toast.variant === 'destructive' && "text-destructive-foreground/50 hover:text-destructive-foreground"
            )}
            onClick={() => onDismiss(toast.id)}
         >
            <X className="h-3 w-3" />
         </button>
      </div>
   );
};

export { Toast };