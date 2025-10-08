// app/shared/properties/page.jsx
'use client';

import React, { useState, useMemo } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { useProperties } from '@/Queries/propertyQuery';
import { FiHome, FiPlus, FiLoader, FiCheck, FiClock, FiUser } from 'react-icons/fi';
import Link from 'next/link';

// Define prop types
const PropertiesPage = ({
   showOnlyApproved = false,
   showOnlyPending = false,
   showAll = false,
   hideFilters = false,
   hideHeader = false,
   hideStats = false,
   title = "Properties",
   description = "Browse through our collection of premium properties",
   showAddButton = true,
   showEditButton = false,
   filterType = null,
   filterSaleOrRent = null,
   filterStatus = null,
   filterAgentId = null // NEW: Filter by specific agent
}) => {
   const [searchQuery, setSearchQuery] = useState('');
   const [filters, setFilters] = useState({
      type: filterType || 'all',
      saleOrRent: filterSaleOrRent || 'all',
      status: filterStatus || 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      city: ''
   });

   // Prepare API filters
   const apiFilters = useMemo(() => {
      const apiFilter = {};

      if (searchQuery) apiFilter.q = searchQuery;

      // Use prop filters first, then user filters
      if (filterType && filterType !== 'all') {
         apiFilter.type = filterType;
      } else if (filters.type !== 'all') {
         apiFilter.type = filters.type;
      }

      if (filterSaleOrRent && filterSaleOrRent !== 'all') {
         apiFilter.saleOrRent = filterSaleOrRent;
      } else if (filters.saleOrRent !== 'all') {
         apiFilter.saleOrRent = filters.saleOrRent;
      }

      if (filterStatus && filterStatus !== 'all') {
         apiFilter.status = filterStatus;
      } else if (filters.status !== 'all') {
         apiFilter.status = filters.status;
      }

      // NEW: Add agent filter
      if (filterAgentId) {
         apiFilter.agent = filterAgentId;
      }

      if (filters.minPrice) apiFilter.minPrice = filters.minPrice;
      if (filters.maxPrice) apiFilter.maxPrice = filters.maxPrice;
      if (filters.bedrooms) apiFilter.bedrooms = filters.bedrooms;
      if (filters.city) apiFilter.city = filters.city;

      // Add approval filters based on props
      if (showOnlyApproved) {
         apiFilter.approved = true;
      } else if (showOnlyPending) {
         apiFilter.approved = false;
      }

      // console.log('🔍 API FILTERS SENT:', apiFilter);
      return apiFilter;
   }, [
      searchQuery,
      filters,
      showOnlyApproved,
      showOnlyPending,
      showAll,
      filterType,
      filterSaleOrRent,
      filterStatus,
      filterAgentId // NEW: Add to dependencies
   ]);

   const {
      data: propertiesData,
      isLoading,
      error,
      isFetching
   } = useProperties(apiFilters);

   const properties = propertiesData?.items || [];
   const totalProperties = propertiesData?.total || 0;

   // Calculate stats based on filtered properties
   const approvedCount = properties.filter(p => p.approved).length;
   const pendingCount = properties.filter(p => !p.approved).length;
   const availableCount = properties.filter(p => p.status === 'available').length;
   const forSaleCount = properties.filter(p => p.saleOrRent === 'sale').length;
   const forRentCount = properties.filter(p => p.saleOrRent === 'rent').length;

   // Check if specific filters are applied via props
   const hasTypeFilter = filterType && filterType !== 'all';
   const hasSaleOrRentFilter = filterSaleOrRent && filterSaleOrRent !== 'all';
   const hasStatusFilter = filterStatus && filterStatus !== 'all';
   const hasAgentFilter = filterAgentId; // NEW

   // Get agent info from first property (if agent filter is applied)
   const agentInfo = hasAgentFilter && properties.length > 0 ? properties[0].agent : null;


   if (error) {
      console.error('❌ PROPERTIES API ERROR:', error);
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-xl font-semibold text-gray-900">Error loading properties</h2>
               <p className="text-gray-600 mt-2">Please try again later.</p>
               <p className="text-sm text-gray-500 mt-1">{error.message}</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header - Conditionally rendered */}
            {!hideHeader && (
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FiHome className="w-8 h-8" />
                        {title}
                        {/* Show badge for filter type */}
                        {showOnlyApproved && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <FiCheck className="w-4 h-4 mr-1" />
                              Verified Only
                           </span>
                        )}
                        {showOnlyPending && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <FiClock className="w-4 h-4 mr-1" />
                              Pending Only
                           </span>
                        )}
                        {showAll && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              All Properties
                           </span>
                        )}
                        {/* Show badges for specific filters */}
                        {hasTypeFilter && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                              {filterType}
                           </span>
                        )}
                        {hasSaleOrRentFilter && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
                              For {filterSaleOrRent === 'sale' ? 'Sale' : 'Rent'}
                           </span>
                        )}
                        {hasStatusFilter && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                              {filterStatus}
                           </span>
                        )}
                        {/* NEW: Agent filter badge */}
                        {hasAgentFilter && agentInfo && (
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                              <FiUser className="w-4 h-4 mr-1" />
                              {agentInfo.name || 'Agent'}
                           </span>
                        )}
                     </h1>
                     <p className="mt-2 text-gray-600">
                        {description}
                        {/* Add agent-specific description */}
                        {hasAgentFilter && agentInfo && (
                           <span className="block text-sm text-gray-500 mt-1">
                              Properties listed by {agentInfo.name}
                              {agentInfo.email && ` • ${agentInfo.email}`}
                              {agentInfo.phone && ` • ${agentInfo.phone}`}
                           </span>
                        )}
                     </p>
                  </div>

                  {showAddButton && (
                     <Link
                        href="/dealer/properties/create"
                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                     >
                        <FiPlus className="w-5 h-5" />
                        Add New Property
                     </Link>
                  )}
               </div>
            )}

            {/* Stats - Enhanced for various filter cases */}
            {!isLoading && !hideStats && (
               <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                     <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
                     <div className="text-sm text-gray-500">
                        {hasAgentFilter ? "Agent's Properties" : "Total Properties"}
                     </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                     <div className="text-2xl font-bold text-gray-900">{availableCount}</div>
                     <div className="text-sm text-gray-500">Available</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                     <div className="text-2xl font-bold text-gray-900">{forSaleCount}</div>
                     <div className="text-sm text-gray-500">For Sale</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                     <div className="text-2xl font-bold text-gray-900">{forRentCount}</div>
                     <div className="text-sm text-gray-500">For Rent</div>
                  </div>

                  {/* Approval Stats - Show both when displaying all properties or when no approval filter is set */}
                  {(showAll || (!showOnlyApproved && !showOnlyPending)) && (
                     <>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                           <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                           <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                              <FiCheck className="w-4 h-4" />
                              Verified
                           </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
                           <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                           <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              Pending
                           </div>
                        </div>
                     </>
                  )}

                  {/* Show filtered status when not showing all */}
                  {!showAll && (
                     <>
                        {showOnlyApproved && (
                           <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200 col-span-2">
                              <div className="text-2xl font-bold text-green-600">{totalProperties}</div>
                              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                                 <FiCheck className="w-4 h-4" />
                                 Verified Properties
                              </div>
                           </div>
                        )}
                        {showOnlyPending && (
                           <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200 col-span-2">
                              <div className="text-2xl font-bold text-yellow-600">{totalProperties}</div>
                              <div className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                                 <FiClock className="w-4 h-4" />
                                 Pending Approval
                              </div>
                           </div>
                        )}
                     </>
                  )}
               </div>
            )}

            {/* Filters - Conditionally rendered, hide if specific filters are set via props */}
            {!hideFilters && !hasTypeFilter && !hasSaleOrRentFilter && !hasStatusFilter && !hasAgentFilter && (
               <PropertyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
               />
            )}

            {/* Loading State */}
            {(isLoading || isFetching) && (
               <div className="flex justify-center items-center py-12">
                  <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading properties...</span>
               </div>
            )}

            {/* Properties Grid */}
            {!isLoading && !isFetching && properties.length > 0 ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {properties.map(property => (
                     <PropertyCard
                        key={property._id}
                        property={property}
                        showApprovalStatus={showAll || (!showOnlyApproved && !showOnlyPending)}
                        showEditButton={showEditButton}
                     />
                  ))}
               </div>
            ) : (
               !isLoading && !isFetching && (
                  <div className="text-center py-12">
                     <FiHome className="mx-auto h-12 w-12 text-gray-400" />
                     <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
                     <p className="mt-2 text-gray-500">
                        {showOnlyApproved && "No verified properties available."}
                        {showOnlyPending && "No properties pending approval."}
                        {hasTypeFilter && `No ${filterType} properties found.`}
                        {hasSaleOrRentFilter && `No properties for ${filterSaleOrRent} found.`}
                        {hasStatusFilter && `No ${filterStatus} properties found.`}
                        {hasAgentFilter && "No properties found for this agent."}
                        {showAll && "No properties found matching your criteria."}
                        {!showOnlyApproved && !showOnlyPending && !hasTypeFilter && !hasSaleOrRentFilter && !hasStatusFilter && !hasAgentFilter && !showAll && "Try adjusting your search or filters to find what you're looking for."}
                     </p>
                  </div>
               )
            )}

            {/* Results Count */}
            {!isLoading && !isFetching && (
               <div className="mt-8 text-center text-gray-500">
                  Showing {properties.length} of {totalProperties} properties
                  {showOnlyApproved && " (Verified Only)"}
                  {showOnlyPending && " (Pending Approval Only)"}
                  {showAll && " (All Properties)"}
                  {hasTypeFilter && ` (${filterType} only)`}
                  {hasSaleOrRentFilter && ` (For ${filterSaleOrRent} only)`}
                  {hasStatusFilter && ` (${filterStatus} only)`}
                  {hasAgentFilter && " (Agent's Properties)"}
               </div>
            )}
         </div>
      </div>
   );
};

export default PropertiesPage;