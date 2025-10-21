// app/super_admin/companies/pending/page.jsx
'use client'

import { useState } from 'react'
import { usePendingCompanies } from '@/Queries/companyQueries'
import { useCompanies } from '@/hooks/useCompanies'
import { CompanyCard } from '../components/CompanyCard'
import { CompanyFilters } from '../components/CompanyFilters'
import { StatusUpdateDialog } from '../components/StatusUpdateDialog'

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
   Loader2,
   Building2,
   Filter,
   RefreshCw,
   AlertCircle,
   CheckCircle2,
   XCircle
} from 'lucide-react'

export default function PendingCompaniesPage() {
   const {
      filters,
      updateFilters,
      selectedCompany,
      isStatusDialogOpen,
      openStatusDialog,
      closeStatusDialog,
      updateCompanyStatus,
      isLoading: isUpdating
   } = useCompanies()

   const {
      data: companiesData,
      isLoading,
      error,
      refetch
   } = usePendingCompanies(filters)

   const pendingCompanies = companiesData?.pendingCompanies || []
   const totalCount = companiesData?.totalCount || 0

   const handleRetry = () => {
      refetch()
   }

   const getStats = () => {
      const statusCounts = {
         pending: 0,
         approved: 0,
         rejected: 0,
         suspended: 0
      }

      pendingCompanies.forEach(company => {
         statusCounts[company.status] = (statusCounts[company.status] || 0) + 1
      })

      return statusCounts
   }

   const stats = getStats()

   if (error) {
      return (
         <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
               <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                     Failed to load pending companies. Please try again.
                  </AlertDescription>
               </Alert>
               <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
               </Button>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                     <Building2 className="h-8 w-8 text-primary-500" />
                     Pending Companies
                  </h1>
                  <p className="text-gray-600 mt-2">
                     Review and manage company registration requests
                  </p>
               </div>
               <Button
                  onClick={() => refetch()}
                  variant="outline"
                  disabled={isLoading}
               >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
               </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <Card>
                  <CardContent className="pt-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-600">Total Pending</p>
                           <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                           <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent className="pt-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-600">Awaiting Review</p>
                           <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                           <AlertCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent className="pt-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-600">Approved</p>
                           <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                           <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent className="pt-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-gray-600">Rejected</p>
                           <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                           <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Filters */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Filter className="h-5 w-5 text-primary-500" />
                     Filters & Search
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <CompanyFilters
                     filters={filters}
                     onFiltersChange={updateFilters}
                     onClearFilters={() => updateFilters({ search: '', page: 1 })}
                  />
               </CardContent>
            </Card>

            {/* Companies List */}
            <Card>
               <CardHeader>
                  <CardTitle>
                     Companies ({totalCount})
                  </CardTitle>
                  <CardDescription>
                     {totalCount === 0
                        ? 'No companies found'
                        : `Showing ${pendingCompanies.length} of ${totalCount} companies`
                     }
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {isLoading ? (
                     <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                        <span className="ml-2 text-gray-600">Loading companies...</span>
                     </div>
                  ) : pendingCompanies.length === 0 ? (
                     <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                           No pending companies
                        </h3>
                        <p className="text-gray-600 max-w-sm mx-auto">
                           {filters.search
                              ? 'No companies match your search criteria. Try adjusting your filters.'
                              : 'All company registration requests have been processed.'
                           }
                        </p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {pendingCompanies.map((company) => (
                           <CompanyCard
                              key={company._id}
                              company={company}
                              onStatusUpdate={openStatusDialog}
                           />
                        ))}
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Status Update Dialog */}
            <StatusUpdateDialog
               company={selectedCompany}
               isOpen={isStatusDialogOpen}
               onClose={closeStatusDialog}
               onUpdate={updateCompanyStatus}
               isLoading={isUpdating}
            />
         </div>
      </div>
   )
}