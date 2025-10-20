// queries/planQueries.js
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// PUBLIC: get all plans (no auth)
export function useAllPlans(options = {}) {
   return useQuery({
      queryKey: ['plans'],
      queryFn: async () => {
         // public endpoint — don’t send cookies/headers
         const { data } = await api.get('/plan/get-all-plans', {
            withCredentials: false,
         });
         // if your API wraps result (e.g. {data: [...]}) adjust here
         return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
   });
}
