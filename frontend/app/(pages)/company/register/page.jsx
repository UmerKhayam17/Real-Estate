// app/company/register/page.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCompanyRegistration } from '@/hooks/useCompanyRegistration'
import { useAllPlans } from '@/Queries'

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Building2, User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const companySchema = z.object({
   // Company Information
   name: z.string().min(2, 'Company name must be at least 2 characters'),
   email: z.string().email('Invalid email address'),
   phone: z.string().min(10, 'Phone number must be at least 10 digits'),
   address: z.string().min(5, 'Address must be at least 5 characters'),
   city: z.string().min(2, 'City is required'),
   licenseNumber: z.string().min(3, 'License number is required'),
   website: z.string().url('Invalid website URL').optional().or(z.literal('')),

   // Owner Information
   ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
   ownerEmail: z.string().email('Invalid owner email address'),
   ownerPassword: z.string().min(3, 'Password must be at least 3 characters'), // Fixed: was min(1)
   ownerPhone: z.string().min(10, 'Owner phone must be at least 10 digits'),

   // Plan Selection
   selectedPlanId: z.string().min(1, 'Please select a plan')
})

export default function CompanyRegisterPage() {
   console.log('Rendering CompanyRegisterPage component')
   const router = useRouter()
   const { submitCompanyRegistration, isLoading, error } = useCompanyRegistration()
   const { data: plansData, isLoading: plansLoading } = useAllPlans()

   const form = useForm({
      resolver: zodResolver(companySchema),
      defaultValues: {
         name: '',
         email: '',
         phone: '',
         address: '',
         city: '',
         licenseNumber: '',
         website: '',
         ownerName: '',
         ownerEmail: '',
         ownerPassword: '',
         ownerPhone: '',
         selectedPlanId: ''
      }
   })

   const onSubmit = async (data) => {
      console.log('Form submitted with data:', data)
      try {
         const result = await submitCompanyRegistration(data)
         console.log('Registration completed, result:', result)
      } catch (error) {
         console.error('Registration failed in component:', error)
      }
   }

   const plans = plansData || []

   // Add this debug section temporarily
   console.log('Current plans data:', plansData)
   console.log('Plans loading:', plansLoading)
   console.log('Form errors:', form.formState.errors)

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Register Your Company
               </h1>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Join PrimeProperties and start managing your real estate business with our powerful platform.
                  Complete the form below to get started.
               </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                        1
                     </div>
                     <span className="ml-2 text-sm font-medium text-primary-600">Company Details</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                        2
                     </div>
                     <span className="ml-2 text-sm font-medium text-gray-500">Verify Owner</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                        3
                     </div>
                     <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
                  </div>
               </div>
            </div>

            <Card className="shadow-xl border-0">
               <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                     <Building2 className="h-6 w-6 text-primary-500" />
                     Company Information
                  </CardTitle>
                  <CardDescription>
                     Fill in your company details and owner information
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  {error && (
                     <Alert variant="destructive">
                        <AlertDescription>
                           {error.response?.data?.message || 'Registration failed. Please try again.'}
                        </AlertDescription>
                     </Alert>
                  )}

                  {/* Temporary debug info - remove after fixing */}
                  {Object.keys(form.formState.errors).length > 0 && (
                     <Alert variant="destructive">
                        <AlertDescription>
                           Form errors: {JSON.stringify(form.formState.errors)}
                        </AlertDescription>
                     </Alert>
                  )}

                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Information Section */}
                        <div className="space-y-4">
                           <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                              <Building2 className="h-5 w-5 text-primary-500" />
                              Company Details
                           </h3>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                 control={form.control}
                                 name="name"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Company Name *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="Enter company name" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="email"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Company Email *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="company@example.com" type="email" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                 control={form.control}
                                 name="phone"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Company Phone *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="+1 (555) 123-4567" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="licenseNumber"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>License Number *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="RE-123456" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>

                           <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Company Address *</FormLabel>
                                    <FormControl>
                                       <Input placeholder="123 Main Street, Suite 100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                 control={form.control}
                                 name="city"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>City *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="New York" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="website"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Website</FormLabel>
                                       <FormControl>
                                          <Input placeholder="https://example.com" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                        </div>

                        {/* Owner Information Section */}
                        <div className="space-y-4 pt-6 border-t">
                           <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                              <User className="h-5 w-5 text-primary-500" />
                              Owner Information
                           </h3>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                 control={form.control}
                                 name="ownerName"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Owner Name *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="John Doe" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="ownerEmail"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Owner Email *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="owner@example.com" type="email" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                 control={form.control}
                                 name="ownerPassword"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Owner Password *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="••••••••" type="password" {...field} />
                                       </FormControl>
                                       <FormDescription>
                                          Minimum 6 characters
                                       </FormDescription>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <FormField
                                 control={form.control}
                                 name="ownerPhone"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Owner Phone *</FormLabel>
                                       <FormControl>
                                          <Input placeholder="+1 (555) 123-4567" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                        </div>

                        {/* Plan Selection Section */}
                        <div className="space-y-4 pt-6 border-t">
                           <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                              <FileText className="h-5 w-5 text-primary-500" />
                              Select Plan
                           </h3>

                           <FormField
                              control={form.control}
                              name="selectedPlanId"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Subscription Plan *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                       <FormControl>
                                          <SelectTrigger>
                                             <SelectValue placeholder="Select a plan for your company" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          {plansLoading ? (
                                             <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                             </div>
                                          ) : plans.length > 0 ? (
                                             plans.filter(plan => plan.isActive && !plan.deleted).map((plan) => (
                                                <SelectItem key={plan._id} value={plan._id}>
                                                   <div className="flex items-center justify-between w-full">
                                                      <span>{plan.name}</span>
                                                      <span className="text-sm text-gray-600 ml-2">
                                                         ${plan.price}/{plan.billingCycle}
                                                      </span>
                                                   </div>
                                                </SelectItem>
                                             ))
                                          ) : (
                                             <div className="text-center py-4 text-gray-500">
                                                No plans available
                                             </div>
                                          )}
                                       </SelectContent>
                                    </Select>
                                    <FormDescription>
                                       Choose the plan that best fits your business needs
                                    </FormDescription>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        <div className="flex justify-end pt-6">
                           <Button
                              type="submit"
                              disabled={isLoading}
                              className="min-w-32"
                           >
                              {isLoading ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                 </>
                              ) : (
                                 'Continue to Verification'
                              )}
                           </Button>
                        </div>
                     </form>
                  </Form>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}