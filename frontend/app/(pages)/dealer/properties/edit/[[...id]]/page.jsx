// app/(pages)/dealer/properties/form/[[...id]]/page.jsx
'use client'

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { useProperty } from '@/Queries/propertyQuery';
import LocationPicker from '../../components/LocationPicker';
import { Button, ButtonGroup } from '@/app/components/common/Buttons';
import {
   BasicInformationSection,
   PropertyDetailsSection,
   AddressSection,
   FeaturesSection,
   MediaUploadSection
} from '../../components/PropertyFormSections';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const PropertyForm = () => {
   const router = useRouter();
   const params = useParams();
   const propertyId = params.id?.[0]; // Get the ID if it exists
   const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();

   const { data: property, isLoading: propertyLoading, error } = useProperty(propertyId);

   const {
      formData,
      setFormData,
      isSubmitting,
      handleInputChange,
      handleNumberChange,
      handleArrayChange,
      handleLocationChange,
      handleSubmit,
      resetForm,
      goBack
   } = usePropertyForm(property); // Pass property to hook

   const isEditMode = Boolean(propertyId);

   useEffect(() => {
      if (!authLoading && !isAuthenticated()) {
         toast.error(`Please login to ${isEditMode ? 'edit' : 'create'} a property`);
         router.push('/login');
      }
   }, [isAuthenticated, authLoading, router, isEditMode]);

   const onSubmit = async (e) => {
      e.preventDefault();

      if (!isAuthenticated()) {
         toast.error(`Please login to ${isEditMode ? 'edit' : 'create'} a property`);
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
         const result = await handleSubmit(e, propertyId);

         if (result.success) {
            toast.success(`Property ${isEditMode ? 'updated' : 'created'} successfully!`);
            router.push('/dealer/properties');
         } else {
            toast.error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} property`);
         }
      } catch (error) {
         toast.error('An unexpected error occurred');
      }
   };

   if (authLoading || (isEditMode && propertyLoading)) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">
                  {isEditMode ? 'Loading property...' : 'Checking authentication...'}
               </p>
            </div>
         </div>
      );
   }

   if (isEditMode && error) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
               <p className="text-gray-600 mb-4">The property you're trying to edit doesn't exist.</p>
               <Button onClick={() => router.push('/dealer/properties')}>
                  Back to Properties
               </Button>
            </div>
         </div>
      );
   }

   if (!isAuthenticated()) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
               <p className="text-gray-600 mb-4">
                  Please login to {isEditMode ? 'edit' : 'create'} a property.
               </p>
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
               <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Property' : 'Add New Property'}
               </h1>
               <p className="mt-2 text-sm text-gray-600">
                  {isEditMode
                     ? 'Update the details of your property listing.'
                     : 'Fill in the details below to list your property for sale or rent.'
                  }
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
                        onClick={() => {
                           if (isEditMode && property) {
                              // Reset to original property data
                              setFormData({
                                 title: property.title || '',
                                 description: property.description || '',
                                 price: property.price || 0,
                                 currency: property.currency || 'PKR',
                                 type: property.type || 'residential',
                                 saleOrRent: property.saleOrRent || 'sale',
                                 status: property.status || 'available',
                                 bedrooms: property.bedrooms || '',
                                 bathrooms: property.bathrooms || '',
                                 area: property.area || '',
                                 address: {
                                    street: property.address?.street || '',
                                    city: property.address?.city || '',
                                    state: property.address?.state || '',
                                    country: property.address?.country || 'Pakistan',
                                    postalCode: property.address?.postalCode || ''
                                 },
                                 location: {
                                    type: 'Point',
                                    coordinates: property.location?.coordinates || [0, 0]
                                 },
                                 media: property.media || [],
                                 features: property.features || [],
                                 agent: property.agent || '',
                                 approved: property.approved || false,
                                 views: property.views || 0
                              });
                           } else {
                              // Reset to empty form for create
                              resetForm();
                           }
                        }}
                        disabled={isSubmitting}
                     >
                        {isEditMode ? 'Reset Changes' : 'Reset Form'}
                     </Button>
                     <Button
                        type="submit"
                        variant="primary"
                        isSubmitting={isSubmitting}
                     >
                        {isSubmitting
                           ? `${isEditMode ? 'Updating' : 'Creating'} Property...`
                           : `${isEditMode ? 'Update' : 'Create'} Property`
                        }
                     </Button>
                  </ButtonGroup>
               </div>
            </form>
         </div>
      </div>
   );
};

export default PropertyForm;