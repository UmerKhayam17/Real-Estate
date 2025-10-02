// hooks/usePropertyForm.js
'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const usePropertyForm = () => {
const router = useRouter();

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
      images: [],
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

   // Handle array fields (features, images)
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

   const goBack=()=>{
      router.back();
   }

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
         images: [],
         features: [],
         agent: '',
         approved: false,
         views: 0
      });
   };

   // Submit handler
   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         // Prepare data for API
         const submitData = {
            ...formData,
            // Convert empty strings to numbers or null
            bedrooms: formData.bedrooms || 0,
            bathrooms: formData.bathrooms || 0,
            area: formData.area || 0,
            // Ensure coordinates are numbers
            location: {
               ...formData.location,
               coordinates: formData.location.coordinates.map(coord => Number(coord) || 0)
            }
         };

         // Here you would make your API call
         console.log('Submitting property:', submitData);

         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 2000));

         // Reset form after successful submission
         resetForm();
         return { success: true, data: submitData };

      } catch (error) {
         console.error('Error submitting property:', error);
         return { success: false, error: error.message };
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
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
   };
};