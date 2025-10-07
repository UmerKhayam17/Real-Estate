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
               params.append(key, value.toString())
            }
         });

         const { data } = await api.get(`/properties?${params.toString()}`);
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