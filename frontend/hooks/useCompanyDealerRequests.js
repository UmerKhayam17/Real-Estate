// hooks/useCompanyDealerRequests.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuth } from './useAuth';

export function useCompanyDealerRequests() {
   const { logout } = useAuth();

   // Get pending join requests
   const { data: requestsData, isLoading, refetch, error } = useQuery({
      queryKey: ['company-pending-requests'],
      queryFn: async () => {
         const { data } = await api.get("/company-join/company/pending");
         return data;
      },
      retry: 1,
   });

   // Respond to join request mutation
   const respondToRequestMutation = useMutation({
      mutationFn: async ({ requestId, action, reason }) => {
         const { data } = await api.post(`/company-join/company/respond/${requestId}`, {
            action,
            reason,
         });
         return data;
      },
      onSuccess: (data) => {
         toast.success(data.message || "Request processed successfully");
         refetch();
      },
      onError: (error) => {
         if (error.response?.status === 401) {
            logout();
         }
         toast.error(error.response?.data?.message || "Failed to process request");
      },
   });

   return {
      pendingRequests: requestsData?.pendingRequests || [],
      stats: {
         totalPending: requestsData?.totalPending || 0,
         dealerLimit: requestsData?.dealerLimit || 0,
         currentDealers: requestsData?.currentDealers || 0,
         canAcceptMore: requestsData?.canAcceptMore || false,
      },
      isLoading,
      respondToRequest: respondToRequestMutation.mutate,
      isResponding: respondToRequestMutation.isLoading,
      error,
   };
}