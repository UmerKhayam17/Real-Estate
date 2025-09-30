import Link from 'next/link'
import React from 'react'

const Navbar = () => {
   return (
      <nav className="bg-navbar text-white shadow-strong">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               {/* Left side - Company logo */}
               <div className="flex items-center">
                  <Link href="/" className="flex items-center hover-lift">
                     <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <span className="font-heading font-bold text-white text-lg">P</span>
                     </div>
                     <span className="ml-2 font-heading text-xl font-semibold">
                        PrimeProperties
                     </span>
                  </Link>
               </div>

               {/* Right side - Login button */}
               <div className="flex items-center">
                  <Link
                     href="/login"
                     className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-soft hover:shadow-medium"
                  >
                     Login
                  </Link>
               </div>
            </div>
         </div>
      </nav>
   )
}

export default Navbar