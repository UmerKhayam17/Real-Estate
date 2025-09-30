'use client'
import React, { useState } from 'react';
import BackgroundImage from "@/public/landing/hero-background.webp";

const HeroSection = () => {
   const [activeTab, setActiveTab] = useState('rent');
   const [propertyType, setPropertyType] = useState('');
   const [bedsBaths, setBedsBaths] = useState('');
   const [bedrooms, setBedrooms] = useState('');
   const [minArea, setMinArea] = useState('');
   const [maxArea, setMaxArea] = useState('');

   // Options data
   const propertyTypeOptions = {
      rent: ['Any Type', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio'],
      buy: ['Any Type', 'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex'],
      newProjects: ['Any Type', 'Apartment', 'Villa', 'Townhouse', 'Residential Building'],
      commercial: ['Office', 'Retail', 'Warehouse', 'Showroom', 'Land', 'Mixed Use']
   };

   const bedsBathsOptions = ['Any', '1 Bed, 1 Bath', '2 Beds, 2 Baths', '3 Beds, 2 Baths', '3 Beds, 3 Baths', '4+ Beds, 3+ Baths'];
   const bedroomsOptions = ['Any', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'];
   const areaOptions = ['500', '1000', '1500', '2000', '2500', '3000', '4000', '5000+'];

   const getPlaceholder = () => {
      switch (activeTab) {
         case 'rent':
         case 'buy':
         case 'commercial':
            return 'City, community or building';
         case 'newProjects':
            return 'Location, project or developer';
         default:
            return 'Search by location, property, or keyword...';
      }
   };

   return (
      <div
         className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url(${BackgroundImage.src})` }}
      >
         {/* Dark overlay for better text readability */}
         <div className="absolute inset-0 bg-black/20"></div>

         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
            {/* Hero Content - Top Section */}
            <div className="text-center mb-12">
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
                  Find Your Dream Home
               </h1>
               <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Discover the perfect property for sale, rent, or investment.
                  Thousands of listings updated daily with verified information.
               </p>
            </div>

            {/* Bottom Section - Tabs and Search */}
            <div className="mt-auto pb-12">
               {/* Property Type Tabs */}
               <div className="max-w-4xl mx-auto mb-8">
                  <div className="flex flex-wrap justify-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl p-2 shadow-medium">
                     {[
                        { id: 'rent', label: 'Rent' },
                        { id: 'buy', label: 'Buy' },
                        { id: 'newProjects', label: 'New Projects' },
                        { id: 'commercial', label: 'Commercial' }
                     ].map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                                 ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                                 : 'text-white hover:text-white hover:bg-white/20'
                              }`}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Search Panel */}
               <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl shadow-strong p-6">
                  {/* Search Bar and Filters in One Horizontal Line */}
                  <div className="flex flex-col lg:flex-row gap-4 items-end">
                     {/* Search Input */}
                     <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                           Search Location
                        </label>
                        <input
                           type="text"
                           placeholder={getPlaceholder()}
                           className="w-full px-4 py-3 text-lg bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder-gray-600"
                        />
                     </div>

                     {/* Property Type */}
                     <div className="min-w-[180px]">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                           Property Type
                        </label>
                        <select
                           value={propertyType}
                           onChange={(e) => setPropertyType(e.target.value)}
                           className="w-full px-4 py-3 bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-800"
                        >
                           {propertyTypeOptions[activeTab].map((option) => (
                              <option key={option} value={option}>{option}</option>
                           ))}
                        </select>
                     </div>

                     {/* Dynamic Filter */}
                     <div className="min-w-[180px]">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                           {activeTab === 'commercial' ? 'Area (sqft)' :
                              activeTab === 'newProjects' ? 'Bedrooms' : 'Beds & Baths'}
                        </label>
                        {activeTab === 'commercial' ? (
                           <div className="flex gap-2">
                              <select
                                 value={minArea}
                                 onChange={(e) => setMinArea(e.target.value)}
                                 className="flex-1 px-3 py-3 bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm"
                              >
                                 <option value="">Min</option>
                                 {areaOptions.map((area) => (
                                    <option key={`min-${area}`} value={area}>{area}</option>
                                 ))}
                              </select>
                              <select
                                 value={maxArea}
                                 onChange={(e) => setMaxArea(e.target.value)}
                                 className="flex-1 px-3 py-3 bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm"
                              >
                                 <option value="">Max</option>
                                 {areaOptions.map((area) => (
                                    <option key={`max-${area}`} value={area}>{area}</option>
                                 ))}
                              </select>
                           </div>
                        ) : (
                           <select
                              value={activeTab === 'newProjects' ? bedrooms : bedsBaths}
                              onChange={(e) => activeTab === 'newProjects' ? setBedrooms(e.target.value) : setBedsBaths(e.target.value)}
                              className="w-full px-4 py-3 bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-800"
                           >
                              {(activeTab === 'newProjects' ? bedroomsOptions : bedsBathsOptions).map((option) => (
                                 <option key={option} value={option}>{option}</option>
                              ))}
                           </select>
                        )}
                     </div>

                     {/* Price Range */}
                     <div className="min-w-[180px]">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                           {activeTab === 'newProjects' ? 'Price Range' : 'Price'}
                        </label>
                        <select className="w-full px-4 py-3 bg-white/95 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-800">
                           {activeTab === 'rent' && (
                              <>
                                 <option>Any Price</option>
                                 <option>Under $1,000</option>
                                 <option>$1,000 - $2,000</option>
                                 <option>$2,000 - $3,000</option>
                                 <option>$3,000 - $5,000</option>
                                 <option>Over $5,000</option>
                              </>
                           )}
                           {activeTab === 'buy' && (
                              <>
                                 <option>Any Price</option>
                                 <option>Under $200,000</option>
                                 <option>$200,000 - $500,000</option>
                                 <option>$500,000 - $1,000,000</option>
                                 <option>$1,000,000 - $2,000,000</option>
                                 <option>Over $2,000,000</option>
                              </>
                           )}
                           {activeTab === 'newProjects' && (
                              <>
                                 <option>Any Price</option>
                                 <option>Under $300,000</option>
                                 <option>$300,000 - $600,000</option>
                                 <option>$600,000 - $1,000,000</option>
                                 <option>Over $1,000,000</option>
                              </>
                           )}
                           {activeTab === 'commercial' && (
                              <>
                                 <option>Any Price</option>
                                 <option>Under $500,000</option>
                                 <option>$500,000 - $1,000,000</option>
                                 <option>$1,000,000 - $2,500,000</option>
                                 <option>Over $2,500,000</option>
                              </>
                           )}
                        </select>
                     </div>

                     {/* Search Button */}
                     <div className="min-w-[120px]">
                        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                           Search
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HeroSection; 