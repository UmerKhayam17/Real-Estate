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
export const PropertyDetailsSection = ({ formData, handleInputChange, handleNumberChange }) => (
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
export const MediaUploadSection = ({ formData, handleArrayChange }) => {
   const handleFilesChange = (newFiles) => {
      console.log('📁 New files received:', newFiles);

      // Convert File objects to the format needed for form data
      const mediaItems = newFiles.map(fileItem => ({
         file: fileItem.file, // Actual File object for upload
         preview: fileItem.preview, // Object URL for preview
         name: fileItem.name,
         // FIX: Better file type detection
         type: fileItem.type?.includes('image') ? 'image' :
            fileItem.type?.includes('video') ? 'video' :
               fileItem.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? 'image' :
                  fileItem.name?.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i) ? 'video' : 'unknown',
         size: fileItem.size,
         isMain: false, // Will be set based on selection
         caption: ''
      }));

      console.log('📦 Processed media items:', mediaItems);
      handleArrayChange('media', mediaItems);
   };

   // Safely handle formData.media - ensure it's always an array
   const mediaValue = Array.isArray(formData.media) ? formData.media : [];

   console.log('🖼️ Current media value:', mediaValue);

   return (
      <div className="space-y-6">
         <h2 className="text-xl font-semibold text-gray-900">Media Upload</h2>

         <FileUpload
            label="Property Images & Videos"
            value={mediaValue}
            onChange={handleFilesChange}
            helperText="Upload images and videos of your property. First image will be used as cover."
            maxSize={20 * 1024 * 1024} // 20MB
            className="md:col-span-2"
         /> 
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
               <h4 className="font-medium mb-2">Tips for better media:</h4>
               <ul className="list-disc list-inside space-y-1">
                  <li>Use high-quality images</li>
                  <li>Show all rooms and key features</li>
                  <li>Include exterior shots</li>
                  <li>Good lighting is essential</li>
               </ul>
            </div>
            <div>
               <h4 className="font-medium mb-2">Requirements:</h4>
               <ul className="list-disc list-inside space-y-1">
                  <li>Max 20MB per file</li>
                  <li>Images: JPEG, PNG, WebP</li>
                  <li>Videos: MP4, MOV, AVI</li>
                  <li>Recommended: 5-10 media files</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

// Features Section
export const FeaturesSection = ({ formData, handleArrayChange }) => (
   <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Features & Amenities</h2>

      <MultiSelectField
         name="features"
         label="Property Features"
         value={formData.features}
         onChange={(e) => handleArrayChange('features', e.target.value)}
         options={FEATURE_OPTIONS}
         placeholder="Select features available"
         helperText="Choose all features that apply to this property"
      />
   </div>
);



