// app/components/FindAgent/AgentCard.jsx
import React from 'react';
import Image from 'next/image';

const AgentCard = ({ agent }) => {
   return (
      <div className="bg-surface rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 border border-border hover:border-primary-300 group">
         <div className="p-4">
            {/* Main Content Layout */}
            <div className="flex gap-4">
               {/* Left Side - Agent Image */}
               <div className="flex-shrink-0">
                  <div className="relative">
                     <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-primary-100 group-hover:border-primary-300 transition-colors">
                        <Image
                           src={agent.image}
                           alt={agent.name}
                           width={80}
                           height={80}
                           className="w-full h-full object-cover"
                        />
                     </div>
                     {/* SuperAgent Badge */}
                     <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-success-500 to-accent-500 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-sm">
                        {agent.type}
                     </div>
                  </div>
               </div>

               {/* Right Side - Agent Info */}
               <div className="flex-1 min-w-0">
                  {/* Header with Name and Company */}
                  <div className="flex items-start justify-between mb-3">
                     <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-text-primary truncate">{agent.name}</h3>
                        <p className="text-text-secondary text-sm mt-1">{agent.title}</p>
                     </div>
                     
                     {/* Company Logo - Top Right */}
                     <div className="w-16 h-14 rounded-lg overflow-hidden border border-border ml-2 flex-shrink-0">
                        <Image
                           src={agent.companyImage}
                           alt="Company"
                           width={48}
                           height={48}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                     <div className="flex text-warning-500 text-sm">
                        {'★'.repeat(5)}
                     </div>
                     <span className="text-sm font-semibold text-text-secondary">{agent.rating}</span>
                  </div>

                  {/* Agent Details */}
                  <div className="space-y-2 text-sm">
                     <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                        </svg>
                        <span className="text-text-secondary">
                           <strong className="font-semibold text-text-primary">Nationality:</strong> {agent.nationality}
                        </span>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span className="text-text-secondary">
                           <strong className="font-semibold text-text-primary">Languages:</strong> {agent.languages.join(', ')}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Property Stats */}
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-primary-600">{agent.forSale}</div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR SALE</div>
               </div>
               <div className="w-px bg-border"></div>
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-accent-600">{agent.forRent}</div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR RENT</div>
               </div>
            </div>

            {/* Contact Button */}
            <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md">
               Contact Agent
            </button>
         </div>
      </div>
   );
};

export default AgentCard;