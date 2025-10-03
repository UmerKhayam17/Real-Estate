// app/(pages)/properties/page.jsx
'use client';

import React, { useState, useMemo } from 'react';
import PropertyCard from './components/PropertyCard';
import PropertyFilters from './components/PropertyFilters';
import { useProperties } from '@/Queries/propertyQuery';
import { FiHome, FiPlus, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

const PropertiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    saleOrRent: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: ''
  });

  // Prepare API filters
  const apiFilters = useMemo(() => {
    const apiFilter = {};

    if (searchQuery) apiFilter.q = searchQuery;
    if (filters.type !== 'all') apiFilter.type = filters.type;
    if (filters.saleOrRent !== 'all') apiFilter.saleOrRent = filters.saleOrRent;
    if (filters.status !== 'all') apiFilter.status = filters.status;
    if (filters.minPrice) apiFilter.minPrice = filters.minPrice;
    if (filters.maxPrice) apiFilter.maxPrice = filters.maxPrice;
    if (filters.bedrooms) apiFilter.bedrooms = filters.bedrooms;
    if (filters.city) apiFilter.city = filters.city;

    console.log('🔍 API FILTERS SENT:', apiFilter);
    return apiFilter;
  }, [searchQuery, filters]);

  const {
    data: propertiesData,
    isLoading,
    error,
    isFetching
  } = useProperties(apiFilters);
  
  const properties = propertiesData?.items || [];
  const totalProperties = propertiesData?.total || 0;

  // Log API response
  React.useEffect(() => {
    if (propertiesData) {
      console.log('🏠 PROPERTIES RECEIVED:', properties);
    }
  }, [propertiesData, properties]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiHome className="w-8 h-8" />
              Properties
            </h1>
            <p className="mt-2 text-gray-600">
              Browse through our collection of premium properties
            </p>
          </div>

          <Link
            href="/dealer/properties/create"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add New Property
          </Link>
        </div>

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
              <div className="text-sm text-gray-500">Total Properties</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.status === 'available').length}
              </div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.saleOrRent === 'sale').length}
              </div>
              <div className="text-sm text-gray-500">For Sale</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {properties.filter(p => p.saleOrRent === 'rent').length}
              </div>
              <div className="text-sm text-gray-500">For Rent</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

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
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          !isLoading && !isFetching && (
            <div className="text-center py-12">
              <FiHome className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )
        )}

        {/* Results Count */}
        {!isLoading && !isFetching && (
          <div className="mt-8 text-center text-gray-500">
            Showing {properties.length} of {totalProperties} properties
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;