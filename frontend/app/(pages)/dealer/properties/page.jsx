// app/(pages)/properties/page.jsx
'use client';

import React, { useState, useMemo } from 'react';
import PropertyCard from './components/PropertyCard';
import PropertyFilters from './components/PropertyFilters';
import { temporaryProperties } from './propertiesData';
import { FiHome, FiPlus } from 'react-icons/fi';
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

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    return temporaryProperties.filter(property => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.street.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = filters.type === 'all' || property.type === filters.type;

      // Sale/Rent filter
      const matchesSaleRent = filters.saleOrRent === 'all' || property.saleOrRent === filters.saleOrRent;

      // Status filter
      const matchesStatus = filters.status === 'all' || property.status === filters.status;

      // Bedrooms filter
      const matchesBedrooms = filters.bedrooms === '' || property.bedrooms >= parseInt(filters.bedrooms);

      // City filter
      const matchesCity = filters.city === '' ||
        property.address.city.toLowerCase().includes(filters.city.toLowerCase());

      return matchesSearch && matchesType && matchesSaleRent && matchesStatus &&
        matchesBedrooms && matchesCity;
    });
  }, [searchQuery, filters]);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{temporaryProperties.length}</div>
            <div className="text-sm text-gray-500">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">
              {temporaryProperties.filter(p => p.status === 'available').length}
            </div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">
              {temporaryProperties.filter(p => p.saleOrRent === 'sale').length}
            </div>
            <div className="text-sm text-gray-500">For Sale</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">
              {temporaryProperties.filter(p => p.saleOrRent === 'rent').length}
            </div>
            <div className="text-sm text-gray-500">For Rent</div>
          </div>
        </div>

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiHome className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-500">
          Showing {filteredProperties.length} of {temporaryProperties.length} properties
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;