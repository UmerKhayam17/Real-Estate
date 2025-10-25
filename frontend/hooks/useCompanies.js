// app/hooks/useCompanies.js
import { useState } from 'react'
import { useUpdateCompanyStatus } from '@/mutations/companyMutations'

export const useCompanies = () => {
   const [selectedCompany, setSelectedCompany] = useState(null)
   const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
   const [filters, setFilters] = useState({
      search: '',
      page: 1,
      limit: 10
   })

   const updateStatusMutation = useUpdateCompanyStatus()

   const openStatusDialog = (company) => {
      setSelectedCompany(company)
      setIsStatusDialogOpen(true)
   }

   const closeStatusDialog = () => {
      setSelectedCompany(null)
      setIsStatusDialogOpen(false)
   }

   const updateCompanyStatus = async (statusData) => {
      if (!selectedCompany) return

      try {
         await updateStatusMutation.mutateAsync({
            companyId: selectedCompany._id,
            ...statusData
         })
         closeStatusDialog()
      } catch (error) {
         throw error
      }
   }

   const updateFilters = (newFilters) => {
      setFilters(prev => ({ ...prev, ...newFilters }))
   }

   return {
      selectedCompany,
      isStatusDialogOpen,
      filters,
      openStatusDialog,
      closeStatusDialog,
      updateCompanyStatus,
      updateFilters,
      isLoading: updateStatusMutation.isPending,
      error: updateStatusMutation.error
   }
}