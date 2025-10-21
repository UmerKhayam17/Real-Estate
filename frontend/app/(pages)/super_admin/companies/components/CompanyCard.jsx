// app/super_admin/companies/components/CompanyCard.jsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Mail, Phone, MapPin, Calendar, User, FileText, ExternalLink } from 'lucide-react'

const STATUS_CONFIG = {
   pending: {
      label: 'Pending Review',
      variant: 'outline',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
   },
   approved: {
      label: 'Approved',
      variant: 'default',
      color: 'text-green-600 bg-green-50 border-green-200'
   },
   rejected: {
      label: 'Rejected',
      variant: 'destructive',
      color: 'text-red-600 bg-red-50 border-red-200'
   },
   suspended: {
      label: 'Suspended',
      variant: 'secondary',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
   }
}

const SUBSCRIPTION_CONFIG = {
   active: {
      label: 'Active',
      variant: 'default'
   },
   inactive: {
      label: 'Inactive',
      variant: 'secondary'
   },
   expired: {
      label: 'Expired',
      variant: 'destructive'
   }
}

export function CompanyCard({ company, onStatusUpdate }) {
   const statusConfig = STATUS_CONFIG[company.status] || STATUS_CONFIG.pending
   const subscriptionConfig = SUBSCRIPTION_CONFIG[company.subscriptionStatus] || SUBSCRIPTION_CONFIG.inactive

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      })
   }

   return (
      <Card className="hover:shadow-md transition-shadow">
         <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
               <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Building2 className="h-5 w-5 text-primary-500" />
                     {company.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                     <Badge variant={statusConfig.variant} className={statusConfig.color}>
                        {statusConfig.label}
                     </Badge>
                     <Badge variant={subscriptionConfig.variant}>
                        {subscriptionConfig.label}
                     </Badge>
                  </CardDescription>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(company)}
               >
                  Update Status
               </Button>
            </div>
         </CardHeader>

         <CardContent className="space-y-3">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
               <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{company.email}</span>
               </div>
               <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
               </div>
               <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                  <MapPin className="h-4 w-4" />
                  <span className="flex-1">
                     {company.address}, {company.city}
                  </span>
               </div>
               {company.website && (
                  <div className="flex items-center gap-2 text-blue-600 md:col-span-2">
                     <ExternalLink className="h-4 w-4" />
                     <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                     >
                        {company.website}
                     </a>
                  </div>
               )}
               <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>License: {company.licenseNumber}</span>
               </div>
            </div>

            {/* Owner Information */}
            <div className="pt-2 border-t">
               <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary-500" />
                  Company Owner
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                     <span className="font-medium">Name:</span>
                     <span>{company.adminId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-medium">Email:</span>
                     <span>{company.adminId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-medium">Phone:</span>
                     <span>{company.adminId?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-medium">Verified:</span>
                     <Badge variant={company.adminId?.verified ? 'default' : 'secondary'}>
                        {company.adminId?.verified ? 'Yes' : 'No'}
                     </Badge>
                  </div>
               </div>
            </div>

            {/* Plan Information */}
            {company.currentPlan && (
               <div className="pt-2 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                     <FileText className="h-4 w-4 text-primary-500" />
                     Subscription Plan
                  </h4>
                  <div className="flex justify-between items-center text-sm">
                     <div>
                        <span className="font-medium">{company.currentPlan.name}</span>
                        <span className="text-gray-600 ml-2">
                           (${company.currentPlan.price}/{company.currentPlan.billingCycle})
                        </span>
                     </div>
                     <div className="text-gray-500 text-xs">
                        Limits: {company.planLimitations?.maxDealers || 0} dealers,
                        {company.planLimitations?.maxProperties || 0} properties
                     </div>
                  </div>
               </div>
            )}

            {/* Registration Date */}
            <div className="pt-2 border-t flex justify-between items-center text-xs text-gray-500">
               <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Registered: {formatDate(company.createdAt)}
               </div>
               <Button variant="ghost" size="sm" asChild>
                  <a href={`/super_admin/companies/${company._id}`}>
                     View Details
                  </a>
               </Button>
            </div>
         </CardContent>
      </Card>
   )
}