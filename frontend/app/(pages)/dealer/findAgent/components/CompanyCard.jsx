// app/components/FindAgent/CompanyCard.jsx
import React from 'react';

const CompanyCard = ({ company }) => {
   return (
      <div className="bg-surface rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 border border-border hover:border-primary-200">
         <div className="p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-2">{company.name}</h3>
            <p className="text-text-secondary text-sm mb-4">{company.office}</p>

            <div className="space-y-3 text-sm text-text-secondary mb-6">
               <div>
                  <span className="font-medium text-text-primary">Location:</span> {company.location}
               </div>
               <div>
                  <span className="font-medium text-text-primary">Agents:</span> {company.agents}
               </div>
               <div>
                  <span className="font-medium text-text-primary">SuperAgents:</span> {company.superAgents}
               </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
               <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">{company.forSale}</div>
                  <div className="text-xs text-text-muted">for sale</div>
               </div>
               <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">{company.forRent}</div>
                  <div className="text-xs text-text-muted">for rent</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CompanyCard;