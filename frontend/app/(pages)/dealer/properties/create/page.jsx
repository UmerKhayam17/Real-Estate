// app/(pages)/properties/create/page.js
'use client'

import React from 'react';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import LocationPicker from '../components/LocationPicker';
import { Button, ButtonGroup } from '@/app/components/common/Buttons';
import {
   BasicInformationSection,
   PropertyDetailsSection,
   AddressSection,
   FeaturesSection,
   MediaUploadSection
} from '../components/PropertyFormSections';
import { toast } from 'react-hot-toast';

const CreateProperty = () => {
   const {
      formData,
      isSubmitting,
      handleInputChange,
      handleNumberChange,
      handleArrayChange,
      handleLocationChange,
      handleSubmit,
      resetForm,
      goBack
   } = usePropertyForm();

   const onSubmit = async (e) => {
      console.log('🎯 FORM SUBMISSION STARTED');
      const result = await handleSubmit(e);

      if (result.success) {
         toast.success('Property created successfully!');
         console.log('🎉 PROPERTY CREATED SUCCESSFULLY');
         // Optionally redirect to properties list
         router.push('/dealer/properties');
      } else {
         toast.error(result.error || 'Failed to create property');
         console.log('💥 PROPERTY CREATION FAILED:', result.error);
      }
   };

   // Log form data changes for debugging
   React.useEffect(() => {
      console.log('🔄 FORM DATA UPDATED:', formData);
   }, [formData]);

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
               <p className="mt-2 text-sm text-gray-600">
                  Fill in the details below to list your property for sale or rent.
               </p>
            </div>

            {/* Property Form */}
            <form onSubmit={onSubmit} className="space-y-8">
               {/* Basic Information */}
               <div className="bg-white shadow rounded-lg p-6">
                  <BasicInformationSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                     handleNumberChange={handleNumberChange}
                  />
               </div>

               {/* Property Details */}
               <div className="bg-white shadow rounded-lg p-6">
                  <PropertyDetailsSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                     handleNumberChange={handleNumberChange}
                  />
               </div>

               {/* Address */}
               <div className="bg-white shadow rounded-lg p-6">
                  <AddressSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                  />
               </div>

               {/* Media Upload */}
               <div className="bg-white shadow rounded-lg p-6">
                  <MediaUploadSection
                     formData={formData}
                     handleArrayChange={handleArrayChange}
                  />
               </div>

               {/* Location Coordinates */}
               <div className="bg-white shadow rounded-lg p-6">
                  <LocationPicker
                     coordinates={formData.location.coordinates}
                     onChange={handleLocationChange}
                  />
               </div>

               {/* Features */}
               <div className="bg-white shadow rounded-lg p-6">
                  <FeaturesSection
                     formData={formData}
                     handleArrayChange={handleArrayChange}
                  />
               </div>

               {/* Form Actions */}
               <div className="bg-white justify-between flex shadow rounded-lg p-6">
                  <ButtonGroup className="justify-start">
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={goBack}
                        disabled={isSubmitting}
                     >
                        Cancel
                     </Button>
                  </ButtonGroup>
                  <ButtonGroup className="justify-end">
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={resetForm}
                        disabled={isSubmitting}
                     >
                        Reset Form
                     </Button>
                     <Button
                        type="submit"
                        variant="primary"
                        isSubmitting={isSubmitting}
                     >
                        {isSubmitting ? 'Creating Property...' : 'Create Property'}
                     </Button>
                  </ButtonGroup>
               </div>
            </form>
         </div>
      </div>
   );
};

export default CreateProperty;