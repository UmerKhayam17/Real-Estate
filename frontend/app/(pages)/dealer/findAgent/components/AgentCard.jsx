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
                     {/* SuperAgent Badge with Fire Icon */}
                     <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-sm flex items-center gap-1">
                        <i className="fi fi-sr-star"></i>
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
                     <div className="w-12 h-12 rounded-lg overflow-hidden border border-border ml-2 flex-shrink-0">
                        <Image
                           src={agent.companyImage}
                           alt="Company"
                           width={48}
                           height={48}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  </div>

                  {/* Rating with Star Icon */}
                  <div className="flex items-center gap-2 mb-3">
                     <div className="flex text-yellow-500 text-sm">
                        <i className="fi fi-sr-star"></i>
                        <i className="fi fi-sr-star"></i>
                        <i className="fi fi-sr-star"></i>
                        <i className="fi fi-sr-star"></i>
                        <i className="fi fi-sr-star"></i>
                     </div>
                     <span className="text-sm font-semibold text-text-secondary">{agent.rating}</span>
                  </div>

                  {/* Agent Details */}
                  <div className="space-y-2 text-sm">
                     <div className="flex items-center gap-2">
                        <i className="fi fi-sr-marker text-primary-500 text-base"></i>
                        <span className="text-text-secondary">
                           <strong className="font-semibold text-text-primary">Nationality:</strong> {agent.nationality}
                        </span>
                     </div>

                     <div className="flex items-center gap-2">
                        <i className="fi fi-sr-comments text-primary-500 text-base"></i>
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
                  <div className="text-xl font-bold text-primary-600 flex items-center justify-center gap-1">
                     <i className="fi fi-sr-tag-alt text-primary-500"></i>
                     {agent.forSale}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR SALE</div>
               </div>
               <div className="w-px bg-border"></div>
               <div className="text-center flex-1">
                  <div className="text-xl font-bold text-accent-600 flex items-center justify-center gap-1">
                     <i className="fi fi-sr-home text-accent-500"></i>
                     {agent.forRent}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">FOR RENT</div>
               </div>
            </div>

            {/* Contact Button with Message Icon */}
            <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
               <i className="fi fi-sr-envelope"></i>
               Contact Agent
            </button>
         </div>
      </div>
   );
};

export default AgentCard;