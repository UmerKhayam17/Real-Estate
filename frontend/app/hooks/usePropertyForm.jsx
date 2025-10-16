// hooks/usePropertyForm.js - Updated for both create and edit
'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCreateProperty, useUpdateProperty } from '@/app/mutations/propertyMutation';
import { isAuthenticated } from '@/app/lib/auth';
import { toast } from 'react-hot-toast';

export const usePropertyForm = (existingProperty = null) => {
   const router = useRouter();
   const createPropertyMutation = useCreateProperty();
   const updatePropertyMutation = useUpdateProperty();

   const [formData, setFormData] = useState({
      // Initial empty state
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

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [mediaToDelete, setMediaToDelete] = useState([]);

   // Populate form when existingProperty changes
   useEffect(() => {
      if (existingProperty) {
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

   // Add function to handle media deletion
   const handleDeleteMedia = (mediaId) => {
      setMediaToDelete(prev => [...prev, mediaId]);
      setFormData(prev => ({
         ...prev,
         media: prev.media.filter(media => media._id !== mediaId)
      }));
   };

   // Add function to handle media reordering or main image change
   const handleSetMainMedia = (mediaId) => {
      setFormData(prev => ({
         ...prev,
         media: prev.media.map(media => ({
            ...media,
            isMain: media._id === mediaId
         }))
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

      if (!isAuthenticated()) {
         toast.error('Please login to continue');
         router.push('/login');
         return { success: false, error: 'Not authenticated' };
      }

      setIsSubmitting(true);

      try {
         console.log('🚀 SUBMITTING PROPERTY FORM - RAW FORM DATA:', formData);

         let cleanedFeatures = [];
         if (Array.isArray(formData.features)) {
            cleanedFeatures = formData.features;
         } else if (typeof formData.features === 'string') {
            try {
               // Handle stringified arrays
               if (formData.features.startsWith('[') && formData.features.endsWith(']')) {
                  cleanedFeatures = JSON.parse(formData.features);
               } else {
                  // Handle comma-separated strings
                  cleanedFeatures = formData.features.split(',').map(f => f.trim()).filter(f => f);
               }
            } catch (error) {
               console.error('Error parsing features:', error);
               cleanedFeatures = [];
            }
         }

         // Final cleanup - ensure all features are strings
         cleanedFeatures = cleanedFeatures
            .filter(feature => feature && typeof feature === 'string')
            .map(feature => feature.trim());

         console.log('✅ Cleaned features for submission:', cleanedFeatures);

         // Prepare the data for API
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
            features: cleanedFeatures, // Use the cleaned features
            media: formData.media,
            approved: formData.approved
         };

         console.log('📦 Prepared submit data:', submitData);

         // For updates, include media to delete
         if (propertyId && mediaToDelete.length > 0) {
            submitData.mediaIdsToDelete = mediaToDelete;
         }

         let result;
         if (propertyId) {
            result = await updatePropertyMutation.mutateAsync({
               id: propertyId,
               propertyData: submitData
            });
         } else {
            result = await createPropertyMutation.mutateAsync(submitData);
         }

         console.log('✅ PROPERTY SUBMISSION SUCCESS:', result);

         // Clear media to delete after successful update
         if (propertyId) {
            setMediaToDelete([]);
         }

         if (!propertyId) {
            resetForm();
         }

         return { success: true, data: result };

      } catch (error) {
         console.error('❌ ERROR SUBMITTING PROPERTY:', error);
         console.error('Error response:', error.response?.data);
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
      handleDeleteMedia,
      handleSetMainMedia,
      handleSubmit,
      resetForm,
      goBack
   };
};