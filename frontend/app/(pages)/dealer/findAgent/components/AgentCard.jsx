// app/components/FindAgent/AgentCard.jsx
import React from 'react';

const AgentCard = ({ agent }) => {
   return (
      <div className="bg-surface rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 border border-border hover:border-primary-200">
         <div className="p-6">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-1">{agent.name}</h3>
                  <p className="text-text-secondary text-sm mb-2">{agent.title}</p>
               </div>
               <span className="bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full font-medium">
                  {agent.type}
               </span>
            </div>

            <div className="flex items-center mb-4">
               <div className="flex text-warning-500">
                  {'★'.repeat(5)}
               </div>
               <span className="ml-2 text-sm text-text-secondary">{agent.rating}</span>
            </div>

            <div className="space-y-2 text-sm text-text-secondary">
               <div>
                  <span className="font-medium text-text-primary">Nationality:</span> {agent.nationality}
               </div>
               <div>
                  <span className="font-medium text-text-primary">Languages:</span> {agent.languages.join(', ')}
               </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-border">
               <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">{agent.forSale}</div>
                  <div className="text-xs text-text-muted">for sale</div>
               </div>
               <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">{agent.forRent}</div>
                  <div className="text-xs text-text-muted">for rent</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AgentCard;