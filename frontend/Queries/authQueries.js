'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// GET USER PROFILE
export function useUserProfile(options = {}) {
   return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/auth/me', {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!localStorage.getItem('token'), // Only run if token exists
      ...options,
   });
}

// CHECK DEALER STATUS
export function useDealerStatus(options = {}) {
   return useQuery({
      queryKey: ['dealer-status'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/auth/dealer/status', {
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

// GET PENDING DEALERS (Admin)
export function usePendingDealers(options = {}) {
   return useQuery({
      queryKey: ['pending-dealers'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/auth/admin/dealers/pending', {
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

// GET ALL USERS (Admin)
export function useAllUsers(filters = {}, options = {}) {
   const { role, verified, search, page = 1, limit = 10 } = filters;

   return useQuery({
      queryKey: ['all-users', { role, verified, search, page, limit }],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const params = new URLSearchParams();

         if (role) params.append('role', role);
         if (verified !== undefined) params.append('verified', verified);
         if (search) params.append('search', search);
         params.append('page', page.toString());
         params.append('limit', limit.toString());

         const { data } = await api.get(`/auth/admin/users?${params.toString()}`, {
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