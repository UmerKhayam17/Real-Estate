import { useQuery } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

export function usePendingCompanies(filters = {}, options = {}) {
   const { search, page = 1, limit = 10 } = filters;

   return useQuery({
      queryKey: ['pending-companies', { search, page, limit }],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const params = new URLSearchParams();

         if (search) params.append('search', search);
         params.append('page', page.toString());
         params.append('limit', limit.toString());

         const { data } = await api.get(`/company/pending?${params.toString()}`, {
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

// GET COMPANY BY ID
export function useCompany(companyId, options = {}) {
   return useQuery({
      queryKey: ['company', companyId],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get(`/company/${companyId}`, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      enabled: !!localStorage.getItem('token') && !!companyId,
      ...options,
   });
}

// GET COMPANY DEALERS
export function useCompanyDealers(companyId, options = {}) {
   return useQuery({
      queryKey: ['company-dealers', companyId],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get(`/company/${companyId}/dealers`, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      staleTime: 2 * 60 * 1000,
      enabled: !!localStorage.getItem('token') && !!companyId,
      ...options,
   });
}