// mutations/propertyMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { getAuthHeaders } from "@/lib/axios";

export const useCreateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (propertyData) => {
         const formData = new FormData();

         Object.keys(propertyData).forEach(key => {
            if (key === 'media') return;
            if (key === 'location') {
               formData.append('location', propertyData[key].coordinates.join(','));
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

// Update property mutation
export const useUpdateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, propertyData }) => {
         const formData = new FormData();

         // Append all basic fields
         Object.keys(propertyData).forEach(key => {
            if (key === 'media') return; // Handle media separately

            if (key === 'location') {
               formData.append('location', JSON.stringify(propertyData[key]));
            } else if (key === 'address') {
               formData.append('address', JSON.stringify(propertyData[key]));
            } else if (key === 'features') {
               formData.append('features', JSON.stringify(propertyData[key]));
            } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
               formData.append(key, propertyData[key]);
            }
         });

         // Handle media for update - different approach than create
         if (propertyData.media && propertyData.media.length > 0) {
            // Send media metadata as JSON string
            const mediaMetadata = propertyData.media.map(mediaItem => ({
               _id: mediaItem._id, // For existing media
               type: mediaItem.type,
               isMain: mediaItem.isMain || false,
               caption: mediaItem.caption || '',
               // Don't send file data here, only metadata
            }));
            formData.append('media', JSON.stringify(mediaMetadata));

            // Append new files separately
            propertyData.media.forEach((mediaItem) => {
               if (mediaItem.file instanceof File) {
                  formData.append('media', mediaItem.file); // This will be handled as new upload
               }
            });
         }

         // Handle media deletions
         if (propertyData.mediaIdsToDelete && propertyData.mediaIdsToDelete.length > 0) {
            formData.append('mediaIdsToDelete', JSON.stringify(propertyData.mediaIdsToDelete));
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
