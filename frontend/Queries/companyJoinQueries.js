// queries/companyJoinQueries.js
import { useQuery } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// GET COMPANIES LIST FOR DROPDOWN
export function useCompaniesList(search = '', options = {}) {
   return useQuery({
      queryKey: ['companies-list', search],
      queryFn: async () => {
         const params = new URLSearchParams();
         if (search) params.append('search', search);

         const { data } = await api.get(`/company-join/companies-list?${params.toString()}`);
         return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
   });
}

// GET COMPANY PENDING JOIN REQUESTS (Company Admin)
export function useCompanyPendingRequests(options = {}) {
   return useQuery({
      queryKey: ['company-pending-requests'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/company-join/company/pending', {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!localStorage.getItem('token'),
      ...options,
   });
}

// GET DEALER'S CURRENT COMPANY STATUS
export function useDealerCompanyStatus(options = {}) {
   return useQuery({
      queryKey: ['dealer-company-status'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/auth/dealer/status', {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      staleTime: 2 * 60 * 1000,
      enabled: !!localStorage.getItem('token'),
      ...options,
   });
}