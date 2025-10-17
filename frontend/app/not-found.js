'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
         <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">Sorry, we could not find the page you are looking for.</p>
            <Link
               href="/"
               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
               Return Home
            </Link>
         </div>
      </div>
   );
}