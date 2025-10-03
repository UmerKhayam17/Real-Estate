// components/property/PropertyCard.jsx
'use client';

import React, { useState } from 'react';
import {
  FiMapPin,
  FiHome,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';
import {
  MdBathtub,
  MdBed,
  MdOutlineSquareFoot,
  MdSell,
  MdHouse
} from 'react-icons/md';
import { getPropertyImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/app/components/common/ImageWithFallback';

const PropertyCard = ({ property }) => {
  const [imageError, setImageError] = useState(false);

  // Get main image using the utility function
  const imageUrl = getPropertyImageUrl(property);
console.log("the iamge urls ois s",imageUrl)
  // Format price with commas
  const formatPrice = (price, currency) => {
    if (!price) return 'Price not set';

    if (currency === 'PKR') {
      return `₨${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'available':
        return { color: 'text-green-600 bg-green-50', text: 'Available' };
      case 'sold':
        return { color: 'text-red-600 bg-red-50', text: 'Sold' };
      case 'rented':
        return { color: 'text-blue-600 bg-blue-50', text: 'Rented' };
      case 'pending':
        return { color: 'text-yellow-600 bg-yellow-50', text: 'Pending' };
      default:
        return { color: 'text-gray-600 bg-gray-50', text: status };
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'residential':
        return <MdHouse className="w-4 h-4" />;
      case 'commercial':
        return <FiDollarSign className="w-4 h-4" />;
      case 'industrial':
        return <MdOutlineSquareFoot className="w-4 h-4" />;
      default:
        return <FiHome className="w-4 h-4" />;
    }
  };

  // In PropertyCard component, add this:
React.useEffect(() => {
  if (imageUrl) {
    console.log('🖼️ Image URL:', imageUrl);
    console.log('📁 Property media:', property.media);
  }
}, [imageUrl, property.media]);

  const statusInfo = getStatusInfo(property.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={property.title || 'Property image'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <FiHome className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Media Count Badge */}
        {property.media && property.media.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            +{property.media.length - 1}
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </div>

        {/* Sale/Rent Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
          {property.saleOrRent === 'sale' ? <MdSell className="w-3 h-3" /> : <FiDollarSign className="w-3 h-3" />}
          {property.saleOrRent === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {formatPrice(property.price, property.currency)}
            {property.saleOrRent === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
          </h3>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {property.title || 'Untitled Property'}
        </h2>

        {/* Description */}
        {property.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.address?.street && `${property.address.street}, `}
            {property.address?.city || 'Location not specified'}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
          <div className="flex items-center gap-4">
            {/* Bedrooms */}
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <MdBed className="w-4 h-4" />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Bathrooms */}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <MdBathtub className="w-4 h-4" />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Area */}
            {property.area > 0 && (
              <div className="flex items-center gap-1">
                <MdOutlineSquareFoot className="w-4 h-4" />
                <span>{property.area.toLocaleString()} sq ft</span>
              </div>
            )}
          </div>
        </div>

        {/* Property Type and Features */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            {getTypeIcon(property.type)}
            <span className="capitalize">{property.type || 'property'}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <FiEye className="w-3 h-3" />
            <span>{property.views || 0} views</span>
          </div>
        </div>

        {/* Features Tags */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md capitalize"
              >
                {feature.replace(/-/g, ' ')}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            {property.approved ? (
              <FiCheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <FiClock className="w-3 h-3 text-yellow-500" />
            )}
            <span>{property.approved ? 'Verified' : 'Pending Approval'}</span>
          </div>

          <div className="text-gray-400 text-xs">
            {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently added'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;