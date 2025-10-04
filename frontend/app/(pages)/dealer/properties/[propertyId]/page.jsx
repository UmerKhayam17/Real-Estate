// app/(pages)/properties/[propertyId]/page.jsx
'use client';

import React from 'react';
import { useProperty } from '@/Queries/propertyQuery';
import { FiArrowLeft, FiMapPin, FiHome, FiDollarSign, FiEye } from 'react-icons/fi';
import { MdBathtub, MdBed, MdOutlineSquareFoot, MdSell } from 'react-icons/md';
import { getPropertyImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/app/components/common/ImageWithFallback';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const PropertyDetailsPage = () => {
   const params = useParams();
   const router = useRouter();
   const propertyId = params.propertyId;

   const {
      data: property,
      isLoading,
      error
   } = useProperty(propertyId);

   // Add this debug effect
   React.useEffect(() => {
      console.log('🔍 Property data received:', property);
   }, [property]);

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading property details...</p>
            </div>
         </div>
      );
   }

   if (error || !property) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-xl font-semibold text-gray-900">Property Not Found</h2>
               <p className="text-gray-600 mt-2">The property you're looking for doesn't exist.</p>
               <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
               >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Properties
               </Link>
            </div>
         </div>
      );
   }

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

   const statusInfo = getStatusInfo(property.status);
   const mainImageUrl = getPropertyImageUrl(property);

   

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => router.back()}
                     className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                     <FiArrowLeft className="w-5 h-5" />
                     Back
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <Link
                     href="/properties"
                     className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                     All Properties
                  </Link>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Image Gallery */}
               <div className="space-y-4">
                  {/* Main Image */}
                  <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                     {mainImageUrl ? (
                        <ImageWithFallback
                           src={mainImageUrl}
                           alt={property.title}
                           className="w-full h-full object-cover"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <FiHome className="w-16 h-16 text-gray-400" />
                        </div>
                     )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {property.media && property.media.length > 1 && (
                     <div className="grid grid-cols-4 gap-2">
                        {property.media.slice(0, 4).map((media, index) => (
                           <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                              <ImageWithFallback
                                 src={media.url}
                                 alt={`${property.title} - Image ${index + 1}`}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                        ))}
                        {property.media.length > 4 && (
                           <div className="rounded-lg bg-gray-100 aspect-square flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                 +{property.media.length - 4}
                              </span>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               {/* Property Details */}
               <div className="space-y-6">
                  {/* Status and Price */}
                  <div className="flex items-start justify-between">
                     <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} mb-2`}>
                           {statusInfo.text}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                           {property.saleOrRent === 'sale' ? (
                              <MdSell className="w-4 h-4" />
                           ) : (
                              <FiDollarSign className="w-4 h-4" />
                           )}
                           <span className="capitalize">{property.saleOrRent}</span>
                           <span>•</span>
                           <span className="capitalize">{property.type}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                           {formatPrice(property.price, property.currency)}
                           {property.saleOrRent === 'rent' && (
                              <span className="text-lg font-normal text-gray-500">/month</span>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Title and Location */}
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {property.title || 'Untitled Property'}
                     </h1>
                     <div className="flex items-center text-gray-600">
                        <FiMapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>
                           {property.address?.street && `${property.address.street}, `}
                           {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                        </span>
                     </div>
                  </div>

                  {/* Description */}
                  {property.description && (
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                     </div>
                  )}

                  {/* Key Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                     {property.bedrooms > 0 && (
                        <div className="text-center">
                           <MdBed className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                           <div className="text-sm font-medium text-gray-900">{property.bedrooms}</div>
                           <div className="text-xs text-gray-500">Bedrooms</div>
                        </div>
                     )}
                     {property.bathrooms > 0 && (
                        <div className="text-center">
                           <MdBathtub className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                           <div className="text-sm font-medium text-gray-900">{property.bathrooms}</div>
                           <div className="text-xs text-gray-500">Bathrooms</div>
                        </div>
                     )}
                     {property.area > 0 && (
                        <div className="text-center">
                           <MdOutlineSquareFoot className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                           <div className="text-sm font-medium text-gray-900">
                              {property.area.toLocaleString()}
                           </div>
                           <div className="text-xs text-gray-500">Sq Ft</div>
                        </div>
                     )}
                     <div className="text-center">
                        <FiEye className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">{property.views || 0}</div>
                        <div className="text-xs text-gray-500">Views</div>
                     </div>
                  </div>

                  {/* Additional Features */}
                  {property.features && property.features.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                        <div className="flex flex-wrap gap-2">
                           {property.features.map((feature, index) => (
                              <span
                                 key={index}
                                 className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                              >
                                 {feature.replace(/-/g, ' ')}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                        <dl className="space-y-2">
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Property Type</dt>
                              <dd className="text-gray-900 capitalize">{property.type}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Year Built</dt>
                              <dd className="text-gray-900">{property.yearBuilt || 'N/A'}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Parking Spaces</dt>
                              <dd className="text-gray-900">{property.parkingSpaces || 'N/A'}</dd>
                           </div>
                        </dl>
                     </div>

                     <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <dl className="space-y-2">
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Listed by</dt>
                              <dd className="text-gray-900">
                                 {property.dealer?.name || 'Unknown Dealer'}
                              </dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Listed on</dt>
                              <dd className="text-gray-900">
                                 {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                              </dd>
                           </div>
                        </dl>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PropertyDetailsPage;