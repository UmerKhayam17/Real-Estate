// app/(pages)/properties/create/page.js
'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useAuth } from '@/hooks/useAuth';

const CreateProperty = () => {
   const router = useRouter();
   const { isAuthenticated, isLoading, getToken } = useAuth();

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

   useEffect(() => {
      if (!isLoading && !isAuthenticated()) {
         toast.error('Please login to create a property');
         router.push('/login');
      }
   }, [isAuthenticated, isLoading, router]);

   const onSubmit = async (e) => {
      e.preventDefault();

      if (!isAuthenticated()) {
         toast.error('Please login to create a property');
         router.push('/login');
         return;
      }

      const token = getToken();
      if (!token) {
         toast.error('Authentication token missing. Please login again.');
         router.push('/login');
         return;
      }

      try {
         const result = await handleSubmit(e);

         if (result.success) {
            toast.success('Property created successfully!');
            router.push('/dealer/properties');
         } else {
            toast.error(result.error || 'Failed to create property');
         }
      } catch (error) {
         toast.error('An unexpected error occurred');
      }
   };

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
         </div>
      );
   }

   if (!isAuthenticated()) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
               <p className="text-gray-600 mb-4">Please login to create a property.</p>
               <Button onClick={() => router.push('/login')}>
                  Go to Login
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
               <p className="mt-2 text-sm text-gray-600">
                  Fill in the details below to list your property for sale or rent.
               </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
               <div className="bg-white shadow rounded-lg p-6">
                  <BasicInformationSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                     handleNumberChange={handleNumberChange}
                  />
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                  <PropertyDetailsSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                     handleNumberChange={handleNumberChange}
                  />
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                  <AddressSection
                     formData={formData}
                     handleInputChange={handleInputChange}
                  />
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                  <MediaUploadSection
                     formData={formData}
                     handleArrayChange={handleArrayChange}
                  />
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                  <LocationPicker
                     coordinates={formData.location.coordinates}
                     onChange={handleLocationChange}
                  />
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                  <FeaturesSection
                     formData={formData}
                     handleArrayChange={handleArrayChange}
                  />
               </div>

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