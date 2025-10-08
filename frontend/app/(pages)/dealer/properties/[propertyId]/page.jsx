// app/(pages)/properties/[propertyId]/page.jsx
'use client';

import React, { useState } from 'react';
import { useProperty } from '@/Queries/propertyQuery';
import {
   FiArrowLeft,
   FiMapPin,
   FiHome,
   FiDollarSign,
   FiEye,
   FiUser,
   FiPhone,
   FiMail
} from 'react-icons/fi';
import {
   MdBathtub,
   MdBed,
   MdOutlineSquareFoot,
   MdSell,
   MdLocationOn,
   MdVerified
} from 'react-icons/md';
import { getImageUrl , getPropertyImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/app/components/common/ImageWithFallback';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const PropertyDetailsPage = () => {
   const params = useParams();
   const router = useRouter();
   const propertyId = params.propertyId;
   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
   const [imageErrors, setImageErrors] = useState({});

   const {
      data: property,
      isLoading,
      error
   } = useProperty(propertyId);

   // Handle image errors
   const handleImageError = (imageUrl) => {
      console.error('❌ Image failed to load:', imageUrl);
      setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
   };

   // Get all images from media array
   const images = property?.media?.filter(media => media.type === 'image') || [];
   // Get the current main image URL
   const mainImageUrl = images[selectedImageIndex]?.url ?
      getImageUrl(images[selectedImageIndex].url) :
      getPropertyImageUrl(property);
      
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
   
   // Get coordinates for map
   const coordinates = property.location?.coordinates || [];
   const statusInfo = getStatusInfo(property.status);

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
                     {mainImageUrl && !imageErrors[mainImageUrl] ? (
                        <ImageWithFallback
                           src={mainImageUrl}
                           alt={property.title}
                           className="w-full h-full object-cover cursor-pointer"
                           onError={() => handleImageError(mainImageUrl)}
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                           <div className="text-center">
                              <FiHome className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Image not available</p>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                     <div className="grid grid-cols-4 gap-2">
                        {images.map((media, index) => {
                           const thumbUrl = getImageUrl(media.url);
                           return (
                              <div
                                 key={media._id}
                                 className={`rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer border-2 ${selectedImageIndex === index ? 'border-primary-600' : 'border-transparent'
                                    }`}
                                 onClick={() => setSelectedImageIndex(index)}
                              >
                                 {thumbUrl && !imageErrors[thumbUrl] ? (
                                    <ImageWithFallback
                                       src={thumbUrl}
                                       alt={`${property.title} - Image ${index + 1}`}
                                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                       onError={() => handleImageError(thumbUrl)}
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                       <FiHome className="w-6 h-6 text-gray-500" />
                                    </div>
                                 )}
                              </div>
                           );
                        })}
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
                           {property.approved && (
                              <>
                                 <span>•</span>
                                 <MdVerified className="w-4 h-4 text-green-500" />
                                 <span className="text-green-600">Verified</span>
                              </>
                           )}
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                           {formatPrice(property.price, property.currency)}
                           {property.saleOrRent === 'rent' && (
                              <span className="text-lg font-normal text-gray-500">/month</span>
                           )}
                        </div>
                        {property.area > 0 && (
                           <div className="text-sm text-gray-500 mt-1">
                              {property.area.toLocaleString()} sq ft
                           </div>
                        )}
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
                           {property.address?.city}, {property.address?.state} {property.address?.postalCode}
                        </span>
                     </div>
                     {coordinates.length === 2 && (
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                           <MdLocationOn className="w-4 h-4 mr-1" />
                           <span>Location: {coordinates[1]}, {coordinates[0]}</span>
                        </div>
                     )}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                           {property.features.map((feature, index) => (
                              <span
                                 key={index}
                                 className="inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm capitalize border border-gray-200"
                              >
                                 {feature.replace(/-/g, ' ')}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                        <dl className="space-y-3">
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Property Type</dt>
                              <dd className="text-gray-900 font-medium capitalize">{property.type}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Sale/Rent</dt>
                              <dd className="text-gray-900 font-medium capitalize">{property.saleOrRent}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Status</dt>
                              <dd className="text-gray-900 font-medium capitalize">{property.status}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Currency</dt>
                              <dd className="text-gray-900 font-medium">{property.currency}</dd>
                           </div>
                           <div className="flex justify-between">
                              <dt className="text-gray-600">Listed on</dt>
                              <dd className="text-gray-900 font-medium">
                                 {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                              </dd>
                           </div>
                        </dl>
                     </div>

                     <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        {property.agent && (
                           <dl className="space-y-3">
                              <div className="flex items-center gap-2">
                                 <FiUser className="w-4 h-4 text-gray-500" />
                                 <div>
                                    <dt className="text-gray-600 text-sm">Agent Name</dt>
                                    <dd className="text-gray-900 font-medium">{property.agent.name}</dd>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <FiPhone className="w-4 h-4 text-gray-500" />
                                 <div>
                                    <dt className="text-gray-600 text-sm">Phone</dt>
                                    <dd className="text-gray-900 font-medium">{property.agent.phone}</dd>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <FiMail className="w-4 h-4 text-gray-500" />
                                 <div>
                                    <dt className="text-gray-600 text-sm">Email</dt>
                                    <dd className="text-gray-900 font-medium">{property.agent.email}</dd>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Link
                                    href={`/properties/agent/${property.agent?._id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                                 >
                                    <FiUser className="w-4 h-4" />
                                    View All Properties
                                 </Link>
                              </div>
                           </dl>
                        )}
                        {!property.agent && (
                           <p className="text-gray-500 text-sm">No agent information available</p>
                        )}
                     </div>
                  </div>

                  {/* Address Details */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                     <h3 className="text-lg font-semibold text-gray-900 mb-3">Address Details</h3>
                     <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                           <dt className="text-gray-600 text-sm">Street</dt>
                           <dd className="text-gray-900 font-medium">{property.address?.street || 'N/A'}</dd>
                        </div>
                        <div>
                           <dt className="text-gray-600 text-sm">City</dt>
                           <dd className="text-gray-900 font-medium">{property.address?.city || 'N/A'}</dd>
                        </div>
                        <div>
                           <dt className="text-gray-600 text-sm">State</dt>
                           <dd className="text-gray-900 font-medium">{property.address?.state || 'N/A'}</dd>
                        </div>
                        <div>
                           <dt className="text-gray-600 text-sm">Postal Code</dt>
                           <dd className="text-gray-900 font-medium">{property.address?.postalCode || 'N/A'}</dd>
                        </div>
                        <div className="md:col-span-2">
                           <dt className="text-gray-600 text-sm">Country</dt>
                           <dd className="text-gray-900 font-medium">{property.address?.country || 'N/A'}</dd>
                        </div>
                     </dl>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PropertyDetailsPage;