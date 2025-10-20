// mutations/planMutations.js
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAuthHeaders } from '@/lib/axios';

// CREATE
export function useCreatePlan() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (body) => {
         const auth = getAuthHeaders(); // adds Authorization if present
         const { data } = await api.post('/plan/create-plan', body, {
            ...auth,
            withCredentials: true, // if your backend uses cookies
         });
         return data;
      },
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['plans'] });
      },
   });
}

// UPDATE
export function useUpdatePlan() {
   const qc = useQueryClient();

   return useMutation({
      // call with { id, ...payload }
      mutationFn: async ({ id, ...body }) => {
         const auth = getAuthHeaders();
         const { data } = await api.patch(`/plan/update-plan/${id}`, body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: (_data, variables) => {
         // Refresh the list and any plan-specific caches you might add later
         qc.invalidateQueries({ queryKey: ['plans'] });
         // e.g. if you add usePlan(id) later:
         // qc.invalidateQueries({ queryKey: ['plan', variables.id] });
      },
   });
}

// DELETE
export function useDeletePlan() {
   const qc = useQueryClient();

   return useMutation({
      mutationFn: async (id) => {
         const auth = getAuthHeaders();
         await api.delete(`/plan/delete-plan/${id}`, {
            ...auth,
            withCredentials: true,
         });
         return id;
      },
      onSuccess: (id) => {
         qc.invalidateQueries({ queryKey: ['plans'] });
         // qc.removeQueries({ queryKey: ['plan', id] }); // if you add a single-plan query later
      },
   });
}

// CHANGE PLAN
export function useChangePlan() {
   const qc = useQueryClient();

   return useMutation({
      // call with the exact body your API expects
      mutationFn: async (body) => {
         const auth = getAuthHeaders();
         const { data } = await api.put('/plan/change-your-plan', body, {
            ...auth,
            withCredentials: true,
         });
         return data;
      },
      onSuccess: (_data, variables) => {
         qc.invalidateQueries({ queryKey: ['plans'] });
         // If the server returns the affected plan id in your body, you can be specific:
         // if (variables?.changingPlanId) {
         //   qc.invalidateQueries({ queryKey: ['plan', variables.changingPlanId] });
         // }
      },
   });
}
