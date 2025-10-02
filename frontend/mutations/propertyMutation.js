// mutations/propertyMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// Create property mutation
export const useCreateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (propertyData) => {
         const formData = new FormData();

         // Append basic fields
         Object.keys(propertyData).forEach(key => {
            if (key === 'media') return; // Handle media separately
            if (key === 'location' && propertyData[key].coordinates) {
               // Convert location to string format "lng,lat"
               formData.append('location', propertyData[key].coordinates.join(','));
            } else if (typeof propertyData[key] === 'object') {
               // Handle nested objects (address)
               Object.keys(propertyData[key]).forEach(nestedKey => {
                  formData.append(`${key}.${nestedKey}`, propertyData[key][nestedKey]);
               });
            } else {
               formData.append(key, propertyData[key]);
            }
         });

         // Append media files
         if (propertyData.media && propertyData.media.length > 0) {
            propertyData.media.forEach((file, index) => {
               if (file.file) { // It's a new file
                  formData.append('media', file.file);
                  if (file.caption) {
                     formData.append('captions', file.caption);
                  }
               }
            });

            // Set main image index
            const mainIndex = propertyData.media.findIndex(media => media.isMain);
            if (mainIndex !== -1) {
               formData.append('mainImageIndex', mainIndex.toString());
            }
         }

         const { data } = await api.post('/properties/create', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         return data;
      },
      onSuccess: () => {
         // Invalidate properties queries
         queryClient.invalidateQueries(['properties']);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

// Update property mutation
export const useUpdateProperty = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, ...updateData }) => {
         const { data } = await api.put(`/properties/${id}`, updateData);
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

// Media management mutations
export const useUpdatePropertyMedia = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, mediaFiles, captions = [], mainImageIndex }) => {
         const formData = new FormData();

         mediaFiles.forEach((file, index) => {
            formData.append('media', file.file);
            if (captions[index]) {
               formData.append('captions', captions[index]);
            }
         });

         if (mainImageIndex !== undefined) {
            formData.append('mainImageIndex', mainImageIndex.toString());
         }

         const { data } = await api.post(`/properties/${id}/media`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         return data;
      },
      onSuccess: (data, variables) => {
         queryClient.invalidateQueries(['property', variables.id]);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

export const useSetMainMedia = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, mediaId }) => {
         const { data } = await api.patch(`/properties/${id}/media/main`, { mediaId });
         return data;
      },
      onSuccess: (data, variables) => {
         queryClient.invalidateQueries(['property', variables.id]);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

export const useDeleteMedia = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ id, mediaId }) => {
         const { data } = await api.delete(`/properties/${id}/media`, { data: { mediaId } });
         return data;
      },
      onSuccess: (data, variables) => {
         queryClient.invalidateQueries(['property', variables.id]);
         queryClient.invalidateQueries(['my-properties']);
      },
   });
};

// Contact property mutation
export const useContactProperty = () => {
   return useMutation({
      mutationFn: async ({ id, contactData }) => {
         const { data } = await api.post(`/properties/${id}/contact`, contactData);
         return data;
      },
   });
};