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
                        <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {company.office}
                     </p>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-3 text-sm">
                     {/* Location */}
                     <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                           <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <span className="text-text-secondary">
                           <strong className="font-semibold text-text-primary">Location:</strong> {company.location}
                        </span>
                     </div>

                     {/* Agent Stats */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                           <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                           </svg>
                           <div>
                              <div className="font-bold text-lg text-text-primary">{company.agents}</div>
                              <div className="text-xs text-text-muted">Total Agents</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <svg className="w-4 h-4 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                           </svg>
                           <div>
                              <div className="font-bold text-lg text-success-600">{company.superAgents}</div>
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
                  <div className="text-xl font-bold text-primary-600">{company.forSale}</div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR SALE</div>
               </div>
               <div className="w-px bg-border"></div>
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-accent-600">{company.forRent}</div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR RENT</div>
               </div>
            </div>

            {/* View Company Button */}
            <button className="w-full mt-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
               View Company
            </button>
         </div>
      </div>
   );
};

export default CompanyCard;