// queries/propertyQuery.js
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// Get all properties with filters
export const useProperties = (filters = {}) => {
   return useQuery({
      queryKey: ['properties', filters],
      queryFn: async () => {
         const params = new URLSearchParams();

         // Add filters to params
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
               params.append(key, value);
            }
         });

         const { data } = await api.get(`/properties?${params.toString()}`);
         console.log("the api data is ", data)
         return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
};

// Get single property
export const useProperty = (id) => {
   return useQuery({
      queryKey: ['property', id],
      queryFn: async () => {
         if (!id) return null;
         const { data } = await api.get(`/properties/${id}`);
         return data;
      },
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
   });
};

// Get user's properties (for dealer)
export const useMyProperties = (filters = {}) => {
   return useQuery({
      queryKey: ['my-properties', filters],
      queryFn: async () => {
         const params = new URLSearchParams();

         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
               params.append(key, value);
            }
         });

         const { data } = await api.get(`/users/me/properties?${params.toString()}`);
         return data;
      },
   });
};