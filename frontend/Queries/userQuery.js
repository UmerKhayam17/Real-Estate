// Queries/userQuery.js
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export const useGetProfile = () => {
  const { logout } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/users/me');
        return data;
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAllUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users/getall');
      return data;
    },
    enabled: user?.role === 'admin', // Only fetch if user is admin
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });
};