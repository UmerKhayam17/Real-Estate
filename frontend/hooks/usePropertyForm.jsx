// hooks/usePropertyForm.js - Updated for both create and edit
'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCreateProperty, useUpdateProperty } from '@/mutations/propertyMutation';

export const usePropertyForm = (existingProperty = null) => {
   const router = useRouter();
   const createPropertyMutation = useCreateProperty();
   const updatePropertyMutation = useUpdateProperty();

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
         coordinates: [0, 0]
      },

      // Media & Features
      media: [],
      features: [],

      // Management
      agent: '',
      approved: false,
      views: 0
   });

   const [isSubmitting, setIsSubmitting] = useState(false);

   // Populate form when existingProperty changes
   useEffect(() => {
      if (existingProperty) {
         console.log('📝 POPULATING FORM WITH EXISTING PROPERTY:', existingProperty);
         setFormData({
            title: existingProperty.title || '',
            description: existingProperty.description || '',
            price: existingProperty.price || 0,
            currency: existingProperty.currency || 'PKR',
            type: existingProperty.type || 'residential',
            saleOrRent: existingProperty.saleOrRent || 'sale',
            status: existingProperty.status || 'available',
            bedrooms: existingProperty.bedrooms || '',
            bathrooms: existingProperty.bathrooms || '',
            area: existingProperty.area || '',
            address: {
               street: existingProperty.address?.street || '',
               city: existingProperty.address?.city || '',
               state: existingProperty.address?.state || '',
               country: existingProperty.address?.country || 'Pakistan',
               postalCode: existingProperty.address?.postalCode || ''
            },
            location: {
               type: 'Point',
               coordinates: existingProperty.location?.coordinates || [0, 0]
            },
            media: existingProperty.media || [],
            features: existingProperty.features || [],
            agent: existingProperty.agent || '',
            approved: existingProperty.approved || false,
            views: existingProperty.views || 0
         });
      }
   }, [existingProperty]);

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

   // Submit handler for both create and update
   const handleSubmit = async (e, propertyId = null) => {
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
               file: mediaItem.file,
               type: mediaItem.type,
               isMain: mediaItem.isMain || false,
               caption: mediaItem.caption || ''
            }))
         };

         console.log('🚀 FINAL DATA SENT TO API:', submitData);

         let result;
         if (propertyId) {
            // Update existing property
            result = await updatePropertyMutation.mutateAsync({
               id: propertyId,
               propertyData: submitData
            });
         } else {
            // Create new property
            result = await createPropertyMutation.mutateAsync(submitData);
         }

         console.log('✅ API RESPONSE:', result);

         if (!propertyId) {
            // Only reset form for new properties
            resetForm();
         }

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
      isSubmitting: isSubmitting || createPropertyMutation.isLoading || updatePropertyMutation.isLoading,
      handleInputChange,
      handleNumberChange,
      handleArrayChange,
      handleLocationChange,
      handleSubmit,
      resetForm,
      goBack
   };
};