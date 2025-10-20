'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/app/lib/axios';

// REGISTER COMPANY
export function useRegisterCompany() {
   return useMutation({
      mutationFn: async (body) => {
         const { data } = await api.post('/company/register', body);
         return data;
      },
   });
}

// VERIFY COMPANY OWNER
export function useVerifyCompanyOwner() {
   return useMutation({
      mutationFn: async (body) => {
         const { data } = await api.post('/company/verify-owner', body);
         return data;
      },
   });
}

// UPDATE COMPANY STATUS (Super Admin)
export function useUpdateCompanyStatus() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async ({ companyId, ...body }) => {
         const auth = getAuthHeaders();
         const { data } = await api.patch(`/company/${companyId}/status`, body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['pending-companies'] });
         qc.invalidateQueries({ queryKey: ['companies'] });
      },
   });
}