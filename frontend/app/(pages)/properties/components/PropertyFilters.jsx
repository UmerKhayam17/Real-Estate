// components/property/PropertyFilters.jsx
'use client';

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const PropertyFilters = ({
   filters,
   onFiltersChange,
   searchQuery,
   onSearchChange
}) => {
   const [showFilters, setShowFilters] = useState(false);

   const propertyTypes = [
      { value: 'all', label: 'All Types' },
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'land', label: 'Land' }
   ];

   const saleRentOptions = [
      { value: 'all', label: 'All' },
      { value: 'sale', label: 'For Sale' },
      { value: 'rent', label: 'For Rent' }
   ];

   const statusOptions = [
      { value: 'all', label: 'All Status' },
      { value: 'available', label: 'Available' },
      { value: 'sold', label: 'Sold' },
      { value: 'rented', label: 'Rented' },
      { value: 'pending', label: 'Pending' }
   ];

   const clearFilters = () => {
      onFiltersChange({
         type: 'all',
         saleOrRent: 'all',
         status: 'all',
         minPrice: '',
         maxPrice: '',
         bedrooms: '',
         city: ''
      });
      onSearchChange('');
   };

   return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
         {/* Search Bar */}
         <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input
                  type="text"
                  placeholder="Search properties by title, location, or description..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
               />
            </div>

            <button
               onClick={() => setShowFilters(!showFilters)}
               className="px-6 py-3 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
               <FiFilter className="w-5 h-5" />
               Filters
               {showFilters && <FiX className="w-4 h-4" />}
            </button>
         </div>

         {/* Advanced Filters */}
         {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
               {/* Property Type */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Property Type
                  </label>
                  <select
                     value={filters.type}
                     onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                           {type.label}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Sale/Rent */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Listing Type
                  </label>
                  <select
                     value={filters.saleOrRent}
                     onChange={(e) => onFiltersChange({ ...filters, saleOrRent: e.target.value })}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     {saleRentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Status */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Status
                  </label>
                  <select
                     value={filters.status}
                     onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Bedrooms */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Bedrooms
                  </label>
                  <select
                     value={filters.bedrooms}
                     onChange={(e) => onFiltersChange({ ...filters, bedrooms: e.target.value })}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                     <option value="">Any</option>
                     <option value="1">1+</option>
                     <option value="2">2+</option>
                     <option value="3">3+</option>
                     <option value="4">4+</option>
                     <option value="5">5+</option>
                  </select>
               </div>

               {/* City */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     City
                  </label>
                  <input
                     type="text"
                     placeholder="Enter city..."
                     value={filters.city}
                     onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
               </div>

               {/* Clear Filters */}
               <div className="flex items-end">
                  <button
                     onClick={clearFilters}
                     className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                     Clear Filters
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default PropertyFilters;