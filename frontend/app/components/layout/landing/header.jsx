'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Header = () => {
   const [activeDropdown, setActiveDropdown] = useState(null)
   const router = useRouter()

   const exploreItems = [
      { name: "Find Developers", path: "/developers" },
      { name: "Area Insights", path: "/area-insights" },
      { name: "Property Blog", path: "/blog" },
      { name: "Insights Hub", path: "/insights" },
      { name: "Know your rights", path: "/rights" }
   ]

   const handleNavigation = (path) => {
      router.push(path)
   }

   return (
      <header className="bg-surface border-b border-border shadow-soft">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
               {/* Left side - Navigation links */}
               <div className="flex items-center space-x-8">
                  <Link
                     href="/buy"
                     className="text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2"
                  >
                     Buy
                  </Link>

                  <Link
                     href="/rent"
                     className="text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2"
                  >
                     Rent
                  </Link>

                  <Link
                     href="/commercial"
                     className="text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2"
                  >
                     Commercial
                  </Link>

                  <Link
                     href="/new-projects"
                     className="text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2"
                  >
                     New projects
                  </Link>

                  <Link
                     href="/find-agent"
                     className="text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2"
                  >
                     Find agent
                  </Link>

                  {/* Explore Dropdown */}
                  <div
                     className="relative"
                     onMouseEnter={() => setActiveDropdown('explore')}
                     onMouseLeave={() => setActiveDropdown(null)}
                  >
                     <button className="flex items-center text-text-primary hover:text-primary-600 font-medium transition-colors duration-200 py-2">
                        Explore
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                     </button>

                     {activeDropdown === 'explore' && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-strong z-50">
                           <div className="py-2">
                              {exploreItems.map((item, index) => (
                                 <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className="block w-full text-left px-4 py-2 text-text-primary hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                                 >
                                    {item.name}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Mortgages - New option */}
                  <Link
                     href="/mortgages"
                     className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 py-2 flex items-center"
                  >
                     Mortgages
                     <span className="ml-1.5 bg-accent-100 text-accent-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        New
                     </span>
                  </Link>
               </div>

               {/* Right side - Search or additional actions */}
               <div className="flex items-center">
                  <button
                     onClick={() => handleNavigation('/search')}
                     className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </header>
   )
}

export default Header