// mutations/propertyMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { getAuthHeaders } from "@/lib/axios";

// mutations/propertyMutation.js - Also fix create mutation
export const useCreateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (propertyData) => {
         console.log('📤 CREATE MUTATION - Raw propertyData:', propertyData);
         console.log('📤 CREATE MUTATION - Features before processing:', propertyData.features);

         const formData = new FormData();

         Object.keys(propertyData).forEach(key => {
            if (key === 'media') return;

            if (key === 'location') {
               formData.append('location', propertyData[key].coordinates.join(','));
            } else if (key === 'features') {
               // FIX: Don't stringify features - send as array
               if (Array.isArray(propertyData[key])) {
                  propertyData[key].forEach(feature => {
                     formData.append('features[]', feature);
                  });
               } else if (propertyData[key]) {
                  formData.append('features[]', propertyData[key]);
               }
            } else if (typeof propertyData[key] === 'object') {
               Object.keys(propertyData[key]).forEach(nestedKey => {
                  const value = propertyData[key][nestedKey];
                  if (value !== null && value !== undefined) {
                     formData.append(`${key}[${nestedKey}]`, value);
                  }
               });
            } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
               formData.append(key, propertyData[key]);
            }
         });

         console.log('📤 CREATE MUTATION - FormData entries:');
         for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
         }

         if (propertyData.media && propertyData.media.length > 0) {
            propertyData.media.forEach((mediaItem) => {
               if (mediaItem.file instanceof File) {
                  formData.append('media', mediaItem.file);
               }
            });
         }

         const authHeaders = getAuthHeaders();
         const headers = {
            'Content-Type': 'multipart/form-data',
            ...authHeaders.headers
         };

         const { data } = await api.post('/properties/create', formData, { headers });
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries(['properties']);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

// mutations/propertyMutation.js - FIXED UPDATE MUTATION
// mutations/propertyMutation.js - FIXED VERSION
export const useUpdateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, propertyData }) => {
         const formData = new FormData();

         console.log('📤 UPDATE MUTATION - Raw propertyData:', propertyData);

         // Append all basic fields
         Object.keys(propertyData).forEach(key => {
            if (key === 'media') return; // Handle media separately
            if (key === 'mediaIdsToDelete') return; // Handle deletions separately

            if (key === 'location') {
               formData.append('location', JSON.stringify(propertyData[key]));
            } else if (key === 'address') {
               formData.append('address', JSON.stringify(propertyData[key]));
            } else if (key === 'features') {
               // Send features as array
               if (Array.isArray(propertyData[key])) {
                  propertyData[key].forEach(feature => {
                     formData.append('features[]', feature);
                  });
               } else if (propertyData[key]) {
                  formData.append('features[]', propertyData[key]);
               }
            } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
               formData.append(key, propertyData[key]);
            }
         });

         // FIX: Use 'media' field name for new file uploads (what backend expects)
         if (propertyData.media && propertyData.media.length > 0) {
            // Separate existing media (with _id) from new uploads (with file)
            const existingMedia = propertyData.media.filter(media => media._id && !media.file);
            const newMedia = propertyData.media.filter(media => media.file instanceof File);

            // Send existing media metadata as JSON
            if (existingMedia.length > 0) {
               const existingMediaMetadata = existingMedia.map(mediaItem => ({
                  _id: mediaItem._id,
                  url: mediaItem.url,
                  type: mediaItem.type,
                  isMain: mediaItem.isMain || false,
                  caption: mediaItem.caption || '',
               }));
               formData.append('existingMedia', JSON.stringify(existingMediaMetadata));
            }

            // FIX: Use 'media' field name for new files (what Multer expects)
            if (newMedia.length > 0) {
               newMedia.forEach((mediaItem) => {
                  formData.append('media', mediaItem.file); // Use 'media' instead of 'newMedia'
               });
            }
         }

         // Handle media deletions
         if (propertyData.mediaIdsToDelete && propertyData.mediaIdsToDelete.length > 0) {
            formData.append('mediaIdsToDelete', JSON.stringify(propertyData.mediaIdsToDelete));
            console.log('📤 UPDATE MUTATION - Media to delete:', propertyData.mediaIdsToDelete);
         }

         const authHeaders = getAuthHeaders();
         const headers = {
            'Content-Type': 'multipart/form-data',
            ...authHeaders.headers
         };

         const { data } = await api.put(`/properties/${id}`, formData, { headers });
         return data;
      },
      onSuccess: (data, variables) => {
         queryClient.invalidateQueries(['property', variables.id]);
         queryClient.invalidateQueries(['properties']);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

// Delete property mutation
export const useDeleteProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (id) => {
         await api.delete(`/properties/${id}`);
         return id;
      },
      onSuccess: (id) => {
         queryClient.invalidateQueries(['properties']);
         queryClient.invalidateQueries(['my-properties']);
         queryClient.removeQueries(['property', id]);
      },
   });
};
  