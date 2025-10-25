'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// UPDATE USER PROFILE
export function useUpdateProfile() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (body) => {
         const auth = getAuthHeaders();
         const { data } = await api.put('/user/profile', body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['user'] });
      },
   });
}

// CHANGE PASSWORD
export function useChangePassword() {
   return useMutation({
      mutationFn: async (body) => {
         const auth = getAuthHeaders();
         const { data } = await api.put('/user/change-password', body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
   });
}