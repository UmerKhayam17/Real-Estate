// hooks/usePropertyForm.js
'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateProperty } from '@/mutations/propertyMutation';

export const usePropertyForm = () => {
   const router = useRouter();
   const createPropertyMutation = useCreateProperty();

   const [formData, setFormData] = useState({
      // Basic Information
      title: '',
      description: '',
      price: 0,
      currency: 'PKR',

      // Property Classification
      type: 'residential',
      saleOrRent: 'sale',
      status: 'available',

      // Property Specifications
      bedrooms: '',
      bathrooms: '',
      area: '',

      // Address
      address: {
         street: '',
         city: '',
         state: '',
         country: 'Pakistan',
         postalCode: ''
      },

      // Location (GeoJSON)
      location: {
         type: 'Point',
         coordinates: [0, 0] // [lng, lat]
      },

      // Media & Features
      media: [], // Changed from 'images' to 'media' to match backend
      features: [],

      // Management
      agent: '', // Will be set from user context
      approved: false,
      views: 0
   });

   const [isSubmitting, setIsSubmitting] = useState(false);

   // Handle input changes
   const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;

      // Handle nested objects (address, location)
      if (name.includes('.')) {
         const [parent, child] = name.split('.');
         setFormData(prev => ({
            ...prev,
            [parent]: {
               ...prev[parent],
               [child]: value
            }
         }));
      } else {
         setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
         }));
      }
   };

   // Handle array fields (features, media)
   const handleArrayChange = (fieldName, value) => {
      setFormData(prev => ({
         ...prev,
         [fieldName]: value
      }));
   };

   // Handle number inputs
   const handleNumberChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value === '' ? '' : Number(value)
      }));
   };

   // Handle location coordinates
   const handleLocationChange = (coordinates) => {
      setFormData(prev => ({
         ...prev,
         location: {
            type: 'Point',
            coordinates
         }
      }));
   };

   const goBack = () => {
      router.back();
   };

   // Reset form
   const resetForm = () => {
      setFormData({
         title: '',
         description: '',
         price: 0,
         currency: 'PKR',
         type: 'residential',
         saleOrRent: 'sale',
         status: 'available',
         bedrooms: '',
         bathrooms: '',
         area: '',
         address: {
            street: '',
            city: '',
            state: '',
            country: 'Pakistan',
            postalCode: ''
         },
         location: {
            type: 'Point',
            coordinates: [0, 0]
         },
         media: [],
         features: [],
         agent: '',
         approved: false,
         views: 0
      });
   };

   // Submit handler with API integration
   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         console.log('📝 FORM DATA TO BE SENT:', formData);

         // Prepare data for API - match backend structure
         const submitData = {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price) || 0,
            currency: formData.currency,
            type: formData.type,
            saleOrRent: formData.saleOrRent,
            status: formData.status,
            bedrooms: Number(formData.bedrooms) || 0,
            bathrooms: Number(formData.bathrooms) || 0,
            area: Number(formData.area) || 0,
            address: {
               street: formData.address.street,
               city: formData.address.city,
               state: formData.address.state,
               country: formData.address.country,
               postalCode: formData.address.postalCode
            },
            location: {
               type: 'Point',
               coordinates: formData.location.coordinates.map(coord => Number(coord) || 0)
            },
            features: formData.features,
            media: formData.media.map(mediaItem => ({
               file: mediaItem.file, // Actual File object for upload
               type: mediaItem.type, // 'image' or 'video'
               isMain: mediaItem.isMain || false,
               caption: mediaItem.caption || ''
            }))
         };

         console.log('🚀 FINAL DATA SENT TO API:', submitData);
         console.log('📤 MEDIA FILES TO UPLOAD:', submitData.media);

         // Call the mutation
         const result = await createPropertyMutation.mutateAsync(submitData);

         console.log('✅ API RESPONSE:', result);

         // Reset form after successful submission
         resetForm();
         return { success: true, data: result };

      } catch (error) {
         console.error('❌ ERROR SUBMITTING PROPERTY:', error);
         console.error('Error details:', error.response?.data);
         return {
            success: false,
            error: error.response?.data?.message || error.message
         };
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      formData,
      setFormData,
      isSubmitting: isSubmitting || createPropertyMutation.isLoading,
      handleInputChange,
      handleNumberChange,
      handleArrayChange,
      handleLocationChange,
      handleSubmit,
      resetForm,
      goBack
   };
};