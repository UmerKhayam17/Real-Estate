// app/super_admin/companies/components/CompanyFilters.jsx
'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

export function CompanyFilters({ filters, onFiltersChange, onClearFilters }) {
   const [localSearch, setLocalSearch] = useState(filters.search || '')

   const handleSearch = (e) => {
      e.preventDefault()
      onFiltersChange({ search: localSearch, page: 1 })
   }

   const handleClear = () => {
      setLocalSearch('')
      onFiltersChange({ search: '', page: 1 })
   }

   const hasActiveFilters = filters.search

   return (
      <div className="space-y-4">
         {/* Search Bar */}
         <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
               <Input
                  placeholder="Search companies by name, email, or license..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10"
               />
            </div>
            <Button type="submit">
               Search
            </Button>
            {hasActiveFilters && (
               <Button type="button" variant="outline" onClick={handleClear}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
               </Button>
            )}
         </form>

         {/* Active Filters */}
         {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
               <Filter className="h-4 w-4" />
               <span>Active filters:</span>
               {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     Search: "{filters.search}"
                     <button onClick={() => onFiltersChange({ search: '' })} className="ml-1">
                        <X className="h-3 w-3" />
                     </button>
                  </Badge>
               )}
            </div>
         )}
      </div>
   )
}