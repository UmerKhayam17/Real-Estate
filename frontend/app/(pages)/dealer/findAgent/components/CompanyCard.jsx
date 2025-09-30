// app/components/FindAgent/CompanyCard.jsx
import React from 'react';
import Image from 'next/image';

const CompanyCard = ({ company }) => {
   return (
      <div className="bg-surface rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 border border-border hover:border-primary-300 group">
         <div className="p-4">
            {/* Main Content Layout */}
            <div className="flex gap-4">
               {/* Left Side - Company Image */}
               <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary-100 group-hover:border-primary-300 transition-colors">
                     <Image
                        src={company.image}
                        alt={company.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                     />
                  </div>
               </div>

               {/* Right Side - Company Info */}
               <div className="flex-1 min-w-0">
                  {/* Company Header */}
                  <div className="mb-3">
                     <h3 className="text-lg font-bold text-text-primary truncate">{company.name}</h3>
                     <p className="text-text-secondary text-sm mt-1 flex items-center gap-1">
                        <i className="fi fi-sr-building text-primary-500"></i>
                        {company.office}
                     </p>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-3 text-sm">
                     {/* Location */}
                     <div className="flex items-center gap-2">
                        <i className="fi fi-sr-marker text-primary-500 text-base"></i>
                        <span className="text-text-secondary">
                           <strong className="font-semibold text-text-primary">Location:</strong> {company.location}
                        </span>
                     </div>

                     {/* Agent Stats */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                           <i className="fi fi-sr-users text-primary-500 text-base"></i>
                           <div>
                              <div className="font-bold text-lg text-text-primary">{company.agents}</div>
                              <div className="text-xs text-text-muted">Total Agents</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <i className="fi fi-sr-star text-yellow-500 text-base"></i>
                           <div>
                              <div className="font-bold text-lg text-yellow-600">{company.superAgents}</div>
                              <div className="text-xs text-text-muted">SuperAgents</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Property Stats */}
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-primary-600 flex items-center justify-center gap-1">
                     <i className="fi fi-sr-tag-alt text-primary-500"></i>
                     {company.forSale}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR SALE</div>
               </div>
               <div className="w-px bg-border"></div>
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-accent-600 flex items-center justify-center gap-1">
                     <i className="fi fi-sr-home text-accent-500"></i>
                     {company.forRent}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR RENT</div>
               </div>
            </div>

            {/* View Company Button */}
            <button className="w-full mt-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
               <i className="fi fi-sr-eye"></i>
               View Company
            </button>
         </div>
      </div>
   );
};

export default CompanyCard;