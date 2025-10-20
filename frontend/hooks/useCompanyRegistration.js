// app/hooks/useCompanyRegistration.js
import { useState } from 'react'
import { useRegisterCompany, useVerifyCompanyOwner } from '@/mutations'
import { useRouter } from 'next/navigation'

export const useCompanyRegistration = () => {
   const [step, setStep] = useState(1)
   const [companyData, setCompanyData] = useState(null)
   const [ownerEmail, setOwnerEmail] = useState('')

   const registerMutation = useRegisterCompany()
   const verifyMutation = useVerifyCompanyOwner()
   const router = useRouter()

   const submitCompanyRegistration = async (data) => {
      try {
         const result = await registerMutation.mutateAsync(data)
         setCompanyData(result)
         setOwnerEmail(data.ownerEmail)
         setStep(2)
         return result
      } catch (error) {
         throw error
      }
   }

   const verifyOwnerOtp = async (otpData) => {
      try {
         const result = await verifyMutation.mutateAsync({
            email: ownerEmail,
            ...otpData
         })
         setStep(3)
         return result
      } catch (error) {
         throw error
      }
   }

   const resetFlow = () => {
      setStep(1)
      setCompanyData(null)
      setOwnerEmail('')
   }

   return {
      step,
      companyData,
      ownerEmail,
      submitCompanyRegistration,
      verifyOwnerOtp,
      resetFlow,
      isLoading: registerMutation.isPending || verifyMutation.isPending,
      error: registerMutation.error || verifyMutation.error
   }
}