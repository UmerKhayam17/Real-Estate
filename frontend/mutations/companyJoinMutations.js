// mutations/companyJoinMutations.js
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// RESPOND TO COMPANY JOIN REQUEST (Company Admin)
export function useRespondToJoinRequest() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async ({ requestId, ...body }) => {
         const auth = getAuthHeaders();
         const { data } = await api.post(`/company-join/company/respond/${requestId}`, body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['company-pending-requests'] });
         qc.invalidateQueries({ queryKey: ['company-dealers'] });
         qc.invalidateQueries({ queryKey: ['dealer-status'] });
      },
   });
}

// LEAVE COMPANY (Dealer)
export function useLeaveCompany() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.post('/company-join/leave-company', {}, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['dealer-status'] });
         qc.invalidateQueries({ queryKey: ['user'] });
         qc.invalidateQueries({ queryKey: ['company-dealers'] });
      },
   });
}