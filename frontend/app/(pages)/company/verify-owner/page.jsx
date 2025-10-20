// app/company/verify-owner/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCompanyRegistration } from '@/hooks/useCompanyRegistration'

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, Shield, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

const otpSchema = z.object({
   otp: z.string().length(6, 'OTP must be 6 digits')
})

export default function VerifyOwnerPage() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const { verifyOwnerOtp, ownerEmail, isLoading, error, resetFlow } = useCompanyRegistration()

   const [countdown, setCountdown] = useState(60)
   const [canResend, setCanResend] = useState(false)

   const form = useForm({
      resolver: zodResolver(otpSchema),
      defaultValues: {
         otp: ''
      }
   })

   useEffect(() => {
      // Redirect if no email in context (direct access)
      if (!ownerEmail) {
         router.push('/company/register')
      }
   }, [ownerEmail, router])

   useEffect(() => {
      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               setCanResend(true)
               return 0
            }
            return prev - 1
         })
      }, 1000)

      return () => clearInterval(timer)
   }, [])

   const onSubmit = async (data) => {
      try {
         await verifyOwnerOtp(data)
      } catch (error) {
         console.error('OTP verification failed:', error)
      }
   }

   const handleResendOtp = () => {
      // Implement resend OTP logic here
      setCountdown(60)
      setCanResend(false)
      // You might want to call an API to resend OTP
   }

   if (!ownerEmail) {
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

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
         <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
               <Link
                  href="/company/register"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                  onClick={resetFlow}
               >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Registration
               </Link>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Ownership
               </h1>
               <p className="text-gray-600">
                  Enter the verification code sent to your email
               </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                        ✓
                     </div>
                     <span className="ml-2 text-sm font-medium text-gray-500">Company Details</span>
                  </div>
                  <div className="w-12 h-0.5 bg-primary-500"></div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                        2
                     </div>
                     <span className="ml-2 text-sm font-medium text-primary-600">Verify Owner</span>
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
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                     <Shield className="h-5 w-5 text-primary-500" />
                     Email Verification
                  </CardTitle>
                  <CardDescription>
                     We sent a 6-digit code to <strong>{ownerEmail}</strong>
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  {error && (
                     <Alert variant="destructive">
                        <AlertDescription>
                           {error.response?.data?.message || 'Verification failed. Please try again.'}
                        </AlertDescription>
                     </Alert>
                  )}

                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                           control={form.control}
                           name="otp"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Verification Code</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter 6-digit code"
                                       maxLength={6}
                                       className="text-center text-lg font-mono tracking-widest"
                                       {...field}
                                       onChange={(e) => {
                                          // Allow only numbers
                                          const value = e.target.value.replace(/\D/g, '')
                                          field.onChange(value)
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="text-center">
                           <Button
                              type="submit"
                              disabled={isLoading}
                              className="w-full"
                           >
                              {isLoading ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                 </>
                              ) : (
                                 'Verify & Continue'
                              )}
                           </Button>
                        </div>

                        <div className="text-center">
                           <p className="text-sm text-gray-600">
                              Didn't receive the code?{' '}
                              {canResend ? (
                                 <Button
                                    variant="link"
                                    className="p-0 h-auto font-semibold"
                                    onClick={handleResendOtp}
                                 >
                                    Resend OTP
                                 </Button>
                              ) : (
                                 <span className="text-gray-500">
                                    Resend in {countdown}s
                                 </span>
                              )}
                           </p>
                        </div>
                     </form>
                  </Form>

                  <Alert>
                     <Mail className="h-4 w-4" />
                     <AlertDescription>
                        Check your spam folder if you don't see the email in your inbox.
                     </AlertDescription>
                  </Alert>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}