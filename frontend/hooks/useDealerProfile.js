// hooks/useDealerProfile.js
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuth } from './useAuth';

export function useDealerProfile() {
   const { user, logout } = useAuth();

   // Get dealer status
   const { data: dealerStatus, isLoading: statusLoading, error } = useQuery({
      queryKey: ['dealer-status'],
      queryFn: async () => {
         const { data } = await api.get("/auth/dealer/status");
         return data;
      },
      enabled: !!user, // Only run if user is authenticated
      retry: 1,
   });

   // Get companies list for dropdown
   const { data: companiesData } = useQuery({
      queryKey: ['companies-list'],
      queryFn: async () => {
         const { data } = await api.get("/company-join/companies-list");
         return data;
      },
      enabled: !!user && !dealerStatus?.hasDealerProfile,
   });

   // Complete dealer profile mutation
   const completeProfileMutation = useMutation({
      mutationFn: async (profileData) => {
         const { data } = await api.post("/auth/dealer/profile", profileData);
         return data;
      },
      onSuccess: (data) => {
         toast.success(data.message || "Profile submitted successfully!");
      },
      onError: (error) => {
         if (error.response?.status === 401) {
            logout();
         }
         toast.error(error.response?.data?.message || "Profile submission failed");
      },
   });

   return {
      dealerStatus,
      statusLoading,
      companies: companiesData?.companies || [],
      completeProfile: completeProfileMutation.mutate,
      isSubmitting: completeProfileMutation.isLoading,
      error,
   };
}