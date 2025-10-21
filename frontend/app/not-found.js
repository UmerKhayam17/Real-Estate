'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
   const router = useRouter();

   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center px-6">
         <h1 className="text-8xl font-extrabold text-sky-600 mb-4">404</h1>
         <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
         <p className="text-gray-600 mb-8 max-w-md">
            The page you’re looking for doesn’t exist or has been moved.
         </p>

         <div className="flex gap-3">
            {/* Go Back Button */}
            <button
               onClick={() => router.back()}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               Go Back
            </button>

            {/* Home Button */}
            <Link
               href="/"
               className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors"
            >
               Return Home
            </Link>
         </div>
      </div>
   );
}
