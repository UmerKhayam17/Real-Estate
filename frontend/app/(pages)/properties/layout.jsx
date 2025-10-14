// app/(pages)/properties/layout.jsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isAuthenticated, getUserRole } from '@/lib/auth';
import AdminLayout from '../admin/layout';
import DealerLayout from '../dealer/layout';
import LandingLayout from '../landing/layout';

export default function PropertiesLayout({ children }) {
   const [userRole, setUserRole] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const pathname = usePathname();

   useEffect(() => {
      const determineLayout = () => {
         if (isAuthenticated()) {
            const role = getUserRole();
            setUserRole(role);
         } else {
            setUserRole('guest');
         }
         setIsLoading(false);
      };

      determineLayout();
   }, [pathname]);

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
         </div>
      );
   }

   // Determine which layout to use
   switch (userRole) {
      case 'admin':
         return <AdminLayout>{children}</AdminLayout>;
      case 'dealer':
         return <DealerLayout>{children}</DealerLayout>;
      case 'guest':
      default:
         // Check if we're in a landing section
         if (pathname.includes('/buy') || pathname.includes('/rent') || pathname.includes('/commercial')) {
            return <LandingLayout>{children}</LandingLayout>;
         }
         return <LandingLayout>{children}</LandingLayout>;
   }
}