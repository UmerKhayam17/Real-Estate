import { useQuery } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// GET USER PROFILE (alternative to auth version)
export function useUser(options = {}) {
   return useQuery({
      queryKey: ['user-profile'],
      queryFn: async () => {
         const auth = getAuthHeaders();
         const { data } = await api.get('/user/profile', {
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