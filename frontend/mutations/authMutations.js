'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// REGISTER USER
export function useRegister() {
   return useMutation({
      mutationFn: async (body) => {
         const { data } = await api.post('/auth/register', body);
         return data;
      },
   });
}

// VERIFY OTP
export function useVerifyOtp() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (body) => {
         const { data } = await api.post('/auth/verify-otp', body);
         return data;
      },
      onSuccess: (data) => {
         // Store token in localStorage or context
         if (data.token) {
            localStorage.setItem('token', data.token);
         }
         // Invalidate user queries
         qc.invalidateQueries({ queryKey: ['user'] });
      },
   });
}

// LOGIN
export function useLogin() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (body) => {
         const { data } = await api.post('/auth/login', body);
         return data;
      },
      onSuccess: (data) => {
         // Store token
         if (data.token) {
            localStorage.setItem('token', data.token);
         }
         // Invalidate user queries
         qc.invalidateQueries({ queryKey: ['user'] });
      },
   });
}

// COMPLETE DEALER PROFILE
export function useCompleteDealerProfile() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (body) => {
         const auth = getAuthHeaders();
         const { data } = await api.post('/auth/dealer/profile', body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['dealer-status'] });
         qc.invalidateQueries({ queryKey: ['user'] });
      },
   });
}

// APPROVE/REJECT DEALER (Admin)
export function useApproveDealer() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async ({ dealerId, ...body }) => {
         const auth = getAuthHeaders();
         const { data } = await api.put(`/auth/admin/dealers/${dealerId}/approval`, body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['pending-dealers'] });
         qc.invalidateQueries({ queryKey: ['all-users'] });
      },
   });
}