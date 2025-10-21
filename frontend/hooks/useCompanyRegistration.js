// app/hooks/useCompanyRegistration.js
import { useRegisterCompany, useVerifyCompanyOwner } from '@/mutations'
import { useCompanyRegistration as useCompanyRegistrationContext } from '@/contexts/CompanyRegistrationContext'

export const useCompanyRegistration = () => {
   const {
      companyData,
      ownerEmail,
      currentStep,
      submitCompanyRegistration: contextSubmit,
      verifyOwnerOtp: contextVerify,
      resetFlow: contextReset
   } = useCompanyRegistrationContext()

   const registerMutation = useRegisterCompany()
   const verifyMutation = useVerifyCompanyOwner()

   const submitCompanyRegistration = async (data) => {
      try {
         console.log('Submitting company registration:', data)
         const result = await registerMutation.mutateAsync(data)
         console.log('Registration successful:', result)

         contextSubmit(data, result)
         return result
      } catch (error) {
         console.error('Registration error:', error)
         throw error
      }
   }

   const verifyOwnerOtp = async (otpData) => {
      try {
         console.log('Verifying OTP for:', ownerEmail)
         const result = await verifyMutation.mutateAsync({
            email: ownerEmail,
            ...otpData
         })
         console.log('OTP verification successful:', result)

         contextVerify(result)
         return result
      } catch (error) {
         console.error('OTP verification error:', error)
         throw error
      }
   }

   return {
      step: currentStep,
      companyData,
      ownerEmail,
      submitCompanyRegistration,
      verifyOwnerOtp,
      resetFlow: contextReset,
      isLoading: registerMutation.isPending || verifyMutation.isPending,
      error: registerMutation.error || verifyMutation.error
   }
}