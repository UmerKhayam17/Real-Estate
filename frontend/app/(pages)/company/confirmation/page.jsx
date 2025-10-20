// app/company/confirmation/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanyRegistration } from '@/hooks/useCompanyRegistration'

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Clock, Building2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function ConfirmationPage() {
   const router = useRouter()
   const { companyData, resetFlow } = useCompanyRegistration()

   useEffect(() => {
      // Redirect if no company data (direct access)
      if (!companyData) {
         router.push('/company/register')
      }
   }, [companyData, router])

   if (!companyData) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <Card className="w-full max-w-md">
               <CardContent className="pt-6">
                  <div className="text-center">
                     <p>Redirecting to registration...</p>
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   const { company, owner } = companyData

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                        ✓
                     </div>
                     <span className="ml-2 text-sm font-medium text-gray-500">Company Details</span>
                  </div>
                  <div className="w-12 h-0.5 bg-green-500"></div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                        ✓
                     </div>
                     <span className="ml-2 text-sm font-medium text-gray-500">Verify Owner</span>
                  </div>
                  <div className="w-12 h-0.5 bg-primary-500"></div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                        3
                     </div>
                     <span className="ml-2 text-sm font-medium text-primary-600">Confirmation</span>
                  </div>
               </div>
            </div>

            <Card className="shadow-xl border-0">
               <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                     <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                     Registration Successful!
                  </CardTitle>
                  <CardDescription className="text-lg">
                     Thank you for registering your company with PrimeProperties
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  {/* Company Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Details
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                           <span className="text-gray-600">Company Name:</span>
                           <p className="font-medium">{company.name}</p>
                        </div>
                        <div>
                           <span className="text-gray-600">Email:</span>
                           <p className="font-medium">{company.email}</p>
                        </div>
                        <div>
                           <span className="text-gray-600">Status:</span>
                           <p className="font-medium capitalize">{company.status}</p>
                        </div>
                        <div>
                           <span className="text-gray-600">Subscription:</span>
                           <p className="font-medium capitalize">{company.subscriptionStatus}</p>
                        </div>
                     </div>
                  </div>

                  {/* Owner Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Owner Information
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                           <span className="text-gray-600">Owner Name:</span>
                           <p className="font-medium">{owner.name}</p>
                        </div>
                        <div>
                           <span className="text-gray-600">Owner Email:</span>
                           <p className="font-medium">{owner.email}</p>
                        </div>
                     </div>
                  </div>

                  {/* Next Steps */}
                  <Alert>
                     <Clock className="h-4 w-4" />
                     <AlertDescription>
                        <strong>What happens next?</strong>
                        <ul className="mt-2 space-y-1 text-sm">
                           <li>• Your company registration is under review by our team</li>
                           <li>• You'll receive an email notification once approved</li>
                           <li>• The approval process typically takes 24-48 hours</li>
                           <li>• After approval, you can log in and access your dashboard</li>
                        </ul>
                     </AlertDescription>
                  </Alert>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                     <Button asChild variant="outline">
                        <Link href="/" onClick={resetFlow}>
                           Back to Home
                        </Link>
                     </Button>
                     <Button asChild>
                        <Link href="/auth/login">
                           Go to Login
                        </Link>
                     </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-4 border-t">
                     <p>
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@primeproperties.com" className="text-primary-600 hover:underline">
                           support@primeproperties.com
                        </a>
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}