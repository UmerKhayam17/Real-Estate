'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/app/lib/axios';

// GET PENDING COMPANIES (Super Admin)
export function usePendingCompanies(options = {}) {
   return useQuery({
      queryKey: ['pending-companies'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/company/pending', {
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

// GET ALL COMPANIES (Admin)
export function useCompanies(options = {}) {
   return useQuery({
      queryKey: ['companies'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/company/', {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!localStorage.getItem('token'),
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