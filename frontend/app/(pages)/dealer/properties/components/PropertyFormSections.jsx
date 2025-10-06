// components/property/PropertyFormSections.js
import React from 'react';
import {
   InputField,
   RadioGroup,
   MultiSelectField,
   TextAreaField,
   Checkbox
} from '@/app/components/common/FormFields';
import FileUpload from '@/app/components/common/FileUpload';
import { getImageUrl } from '@/utils/imageUtils';

// Options for dropdowns
export const PROPERTY_TYPES = [
   { value: 'residential', label: 'Residential' },
   { value: 'commercial', label: 'Commercial' },
   { value: 'industrial', label: 'Industrial' },
   { value: 'land', label: 'Land' },
   { value: 'special-purpose', label: 'Special Purpose' }
];

export const SALE_RENT_OPTIONS = [
   { value: 'sale', label: 'For Sale' },
   { value: 'rent', label: 'For Rent' }
];

export const STATUS_OPTIONS = [
   { value: 'available', label: 'Available' },
   { value: 'sold', label: 'Sold' },
   { value: 'rented', label: 'Rented' },
   { value: 'pending', label: 'Pending' }
];

export const CURRENCY_OPTIONS = [
   { value: 'PKR', label: 'Pakistani Rupee (PKR)' },
   { value: 'USD', label: 'US Dollar (USD)' },
   { value: 'EUR', label: 'Euro (EUR)' }
];

export const FEATURE_OPTIONS = [
   { value: 'parking', label: 'Parking' },
   { value: 'garden', label: 'Garden' },
   { value: 'pool', label: 'Swimming Pool' },
   { value: 'security', label: 'Security' },
   { value: 'furnished', label: 'Furnished' },
   { value: 'air-conditioning', label: 'Air Conditioning' },
   { value: 'heating', label: 'Heating' },
   { value: 'balcony', label: 'Balcony' },
   { value: 'fireplace', label: 'Fireplace' },
   { value: 'elevator', label: 'Elevator' }
];

// Admin Section (Only visible to admin users)
export const AdminSection = ({ formData, handleInputChange, isAdmin = false }) => {
   if (!isAdmin) return null;

   return (
      <div className="space-y-6">
         <h2 className="text-xl font-semibold text-gray-900">Admin Controls</h2>

         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
               <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
               </div>
               <div>
                  <h4 className="text-sm font-medium text-yellow-800">Admin Controls</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                     These settings are only available to administrators.
                  </p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            <Checkbox
               name="approved"
               label="Approve Property Listing"
               checked={formData.approved}
               onChange={handleInputChange}
               helperText="When approved, this property will be visible to all users on the platform"
            />

            {formData.approved && (
               <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     <span className="text-sm font-medium text-green-800">Property is approved and visible to users</span>
                  </div>
               </div>
            )}

            {!formData.approved && (
               <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     <span className="text-sm font-medium text-orange-800">Property is pending approval and not visible to users</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

// Basic Information Section
export const BasicInformationSection = ({ formData, handleInputChange, handleNumberChange }) => (
   <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

      <InputField
         name="title"
         label="Property Title"
         value={formData.title}
         onChange={handleInputChange}
         placeholder="Enter property title"
         required
         fullWidth
         helperText="A clear and descriptive title for your property"
         icon="home"
      />

      <TextAreaField
         name="description"
         label="Description"
         value={formData.description}
         onChange={handleInputChange}
         placeholder="Describe the property in detail..."
         rows={4}
         fullWidth
         helperText="Provide detailed information about the property features, amenities, and unique selling points"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <InputField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleNumberChange}
            placeholder="Enter price"
            required
            prefix={formData.currency}
            helperText="Enter the property price"
         />

         <InputField
            name="currency"
            label="Currency"
            type="select"
            value={formData.currency}
            onChange={handleInputChange}
            options={CURRENCY_OPTIONS}
            required
         />

         <InputField
            name="area"
            label="Area (sq ft)"
            type="number"
            value={formData.area}
            onChange={handleNumberChange}
            placeholder="Enter area"
            helperText="Total area in square feet"
            icon="number"
         />
      </div>
   </div>
);

// Property Details Section
export const PropertyDetailsSection = ({ formData, handleInputChange, handleNumberChange, isAdmin = false }) => (
   <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <InputField
            name="type"
            label="Property Type"
            type="select"
            value={formData.type}
            onChange={handleInputChange}
            options={PROPERTY_TYPES}
            required
         />

         <RadioGroup
            name="saleOrRent"
            label="Listing Type"
            value={formData.saleOrRent}
            onChange={handleInputChange}
            options={SALE_RENT_OPTIONS}
         />

         <InputField
            name="status"
            label="Status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            options={STATUS_OPTIONS}
            required
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <InputField
            name="bedrooms"
            label="Bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleNumberChange}
            placeholder="Number of bedrooms"
            icon="home"
         />

         <InputField
            name="bathrooms"
            label="Bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleNumberChange}
            placeholder="Number of bathrooms"
            icon="home"
         />

         {/* Show views count for admin users */}
         {isAdmin && (
            <InputField
               name="views"
               label="Views"
               type="number"
               value={formData.views}
               onChange={handleNumberChange}
               placeholder="View count"
               icon="eye"
               disabled
               helperText="Total views (read-only)"
            />
         )}
      </div>
   </div>
);

// Address Section
export const AddressSection = ({ formData, handleInputChange }) => (
   <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Address</h2>

      <InputField
         name="address.street"
         label="Street Address"
         value={formData.address.street}
         onChange={handleInputChange}
         placeholder="Enter street address"
         fullWidth
         helperText="Full street address"
         icon="home"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <InputField
            name="address.city"
            label="City"
            value={formData.address.city}
            onChange={handleInputChange}
            placeholder="Enter city"
            required
            helperText="e.g., Karachi, Lahore, Islamabad"
         />

         <InputField
            name="address.state"
            label="State/Province"
            value={formData.address.state}
            onChange={handleInputChange}
            placeholder="Enter state or province"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <InputField
            name="address.country"
            label="Country"
            value={formData.address.country}
            onChange={handleInputChange}
            placeholder="Enter country"
            required
         />

         <InputField
            name="address.postalCode"
            label="Postal Code"
            value={formData.address.postalCode}
            onChange={handleInputChange}
            placeholder="Enter postal code"
            icon="idCard"
         />
      </div>
   </div>
);

// Media Upload Section
export const MediaUploadSection = ({ formData, handleArrayChange, onDeleteMedia, onSetMainMedia }) => {
   const handleFilesChange = (newFiles) => {
      const mediaItems = newFiles.map(fileItem => ({
         file: fileItem.file,
         preview: fileItem.preview,
         name: fileItem.name,
         type: fileItem.type?.includes('image') ? 'image' :
            fileItem.type?.includes('video') ? 'video' :
               fileItem.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? 'image' :
                  fileItem.name?.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i) ? 'video' : 'unknown',
         size: fileItem.size,
         isMain: formData.media.length === 0 && newFiles.length === 1,
         caption: ''
      }));

      handleArrayChange('media', [...formData.media, ...mediaItems]);
   };

   const handleDelete = (index, mediaId) => {
      if (mediaId && onDeleteMedia) {
         // Existing media with ID
         onDeleteMedia(mediaId);
      } else {
         // Newly uploaded media without ID
         const updatedMedia = formData.media.filter((_, i) => i !== index);
         handleArrayChange('media', updatedMedia);
      }
   };

   const handleSetMain = (index, mediaId) => {
      if (onSetMainMedia) {
         onSetMainMedia(mediaId);
      } else {
         const updatedMedia = formData.media.map((media, i) => ({
            ...media,
            isMain: i === index
         }));
         handleArrayChange('media', updatedMedia);
      }
   };

   const mediaValue = Array.isArray(formData.media) ? formData.media : [];

   // Separate existing media (with _id) from new uploads (with file object)
   const existingMedia = mediaValue.filter(media => media._id);
   const newMedia = mediaValue.filter(media => !media._id && media.file);

   return (
      <div className="space-y-6">
         <h2 className="text-xl font-semibold text-gray-900">Media Upload</h2>

         <FileUpload
            label="Property Images & Videos"
            value={mediaValue}
            onChange={handleFilesChange}
            onDelete={handleDelete}
            onSetMain={handleSetMain}
            helperText="Upload images and videos of your property. First image will be used as cover."
            maxSize={20 * 1024 * 1024} // 20MB
            className="md:col-span-2"
         />

         {/* Show existing media from database */}
         {existingMedia.length > 0 && (
            <div className="mt-6">
               <h4 className="font-medium mb-4 text-lg">Existing Media</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingMedia.map((media, index) => {
                     const mediaIndex = mediaValue.findIndex(m => m._id === media._id);
                     return (
                        <div key={media._id} className="relative group border rounded-lg overflow-hidden">
                           <img
                              src={getImageUrl(media.url)}
                              alt={media.caption || `Media ${index + 1}`}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                 console.error('Failed to load existing image:', media.url);
                              }}
                           />
                           {media.isMain && (
                              <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                 Main
                              </span>
                           )}
                           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                 type="button"
                                 onClick={() => handleSetMain(mediaIndex, media._id)}
                                 className="bg-white text-gray-800 p-1 rounded mr-1 text-xs"
                              >
                                 Set Main
                              </button>
                              <button
                                 type="button"
                                 onClick={() => handleDelete(mediaIndex, media._id)}
                                 className="bg-red-500 text-white p-1 rounded text-xs"
                              >
                                 Delete
                              </button>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {/* Show newly uploaded media previews */}
         {newMedia.length > 0 && (
            <div className="mt-4">
               <h4 className="font-medium mb-2">New Uploads</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newMedia.map((media, index) => {
                     const mediaIndex = mediaValue.findIndex(m => m.file === media.file);
                     return (
                        <div key={index} className="relative group border rounded-lg overflow-hidden">
                           <img
                              src={media.preview}
                              alt={media.caption || `New media ${index + 1}`}
                              className="w-full h-24 object-cover"
                           />
                           {media.isMain && (
                              <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                 Main
                              </span>
                           )}
                           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                 type="button"
                                 onClick={() => handleSetMain(mediaIndex)}
                                 className="bg-white text-gray-800 p-1 rounded mr-1 text-xs"
                              >
                                 Set Main
                              </button>
                              <button
                                 type="button"
                                 onClick={() => handleDelete(mediaIndex)}
                                 className="bg-red-500 text-white p-1 rounded text-xs"
                              >
                                 Delete
                              </button>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </div>
   );
};

// In PropertyFormSections.js - Update FeaturesSection
// In PropertyFormSections.js - Update FeaturesSection to handle stringified data
export const FeaturesSection = ({ formData, handleArrayChange }) => {
   // Enhanced feature value parsing
   const featuresValue = React.useMemo(() => {
      if (Array.isArray(formData.features)) {
         return formData.features;
      }

      if (typeof formData.features === 'string') {
         try {
            // Handle stringified arrays from database response
            if (formData.features.startsWith('[') && formData.features.endsWith(']')) {
               const parsed = JSON.parse(formData.features);
               return Array.isArray(parsed) ? parsed : [parsed];
            } else {
               // Handle comma-separated string
               return formData.features.split(',').map(f => f.trim()).filter(f => f);
            }
         } catch (error) {
            console.error('Error parsing features:', error);
            return [];
         }
      }

      return [];
   }, [formData.features]);

   const handleFeaturesChange = (selectedFeatures) => {
      console.log('FeaturesSection - Setting features:', selectedFeatures);
      handleArrayChange('features', selectedFeatures);
   };

   return (
      <div className="space-y-6">
         <h2 className="text-xl font-semibold text-gray-900">Features & Amenities</h2>

         <MultiSelectField
            name="features"
            label="Property Features"
            value={featuresValue}
            onChange={(e) => handleFeaturesChange(e.target.value)}
            options={FEATURE_OPTIONS}
            placeholder="Select features available"
            helperText="Choose all features that apply to this property"
         />

         {/* Enhanced debug info */}
         {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-3 rounded text-xs space-y-1">
               <p><strong>Features Debug:</strong></p>
               <p>Raw formData.features: {JSON.stringify(formData.features)}</p>
               <p>Processed featuresValue: {JSON.stringify(featuresValue)}</p>
               <p>Raw type: {typeof formData.features}</p>
               <p>Is Array: {Array.isArray(formData.features).toString()}</p>
            </div>
         )}
      </div>
   );
};