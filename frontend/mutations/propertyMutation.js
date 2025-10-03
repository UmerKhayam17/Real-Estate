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