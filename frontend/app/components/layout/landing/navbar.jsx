// app/components/layout/navbar.jsx
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

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

               {/* Right side - Actions */}
               <div className="flex items-center space-x-4">
                  <Link href="/company/register">
                     <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                        Register Company
                     </Button>
                  </Link>
                  <Link href="/auth/login">
                     <Button className="bg-primary-500 hover:bg-primary-600">
                        Login
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </nav>
   )
}

export default Navbar