// app/components/FindAgent/SearchFilters.jsx
import React from 'react';

const SearchFilters = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
   return (
      <div className="bg-surface rounded-lg shadow-soft p-6 max-w-4xl border border-border">
         {/* Tab Selection */}
         <div className="flex space-x-4 mb-6">
            <button
               className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'agents'
                     ? 'bg-primary-600 text-white shadow-medium'
                     : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-border'
                  }`}
               onClick={() => setActiveTab('agents')}
            >
               Agents
            </button>
            <button
               className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'companies'
                     ? 'bg-primary-600 text-white shadow-medium'
                     : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-border'
                  }`}
               onClick={() => setActiveTab('companies')}
            >
               Companies
            </button>
         </div>

         {/* Search Bar */}
         <div className="mb-4">
            <input
               type="text"
               placeholder={`Search ${activeTab}...`}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder-text-muted"
            />
         </div>

         {/* Filter Options */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab === 'agents' ? (
               <>
                  <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary">
                     <option>Service Needed</option>
                     <option>Buying</option>
                     <option>Renting</option>
                     <option>Selling</option>
                  </select>
                  <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary">
                     <option>Language</option>
                     <option>English</option>
                     <option>Arabic</option>
                     <option>French</option>
                  </select>
                  <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary">
                     <option>Nationality</option>
                     <option>UAE</option>
                     <option>UK</option>
                     <option>USA</option>
                  </select>
               </>
            ) : (
               <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface text-text-primary md:col-span-3">
                  <option>Services Needed</option>
                  <option>Residential Sales</option>
                  <option>Commercial Leasing</option>
                  <option>Property Management</option>
               </select>
            )}
         </div>
      </div>
   );
};

export default SearchFilters;