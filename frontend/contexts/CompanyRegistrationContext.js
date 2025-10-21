// app/contexts/CompanyRegistrationContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CompanyRegistrationContext = createContext(undefined)

export function CompanyRegistrationProvider({ children }) {
   const [companyData, setCompanyData] = useState(null)
   const [ownerEmail, setOwnerEmail] = useState('')
   const [currentStep, setCurrentStep] = useState(1)
   const router = useRouter()

   // Load from sessionStorage on mount
   useEffect(() => {
      const savedData = sessionStorage.getItem('companyRegistrationData')
      if (savedData) {
         const { companyData, ownerEmail, step } = JSON.parse(savedData)
         setCompanyData(companyData)
         setOwnerEmail(ownerEmail)
         setCurrentStep(step)
      }
   }, [])

   // Save to sessionStorage whenever state changes
   useEffect(() => {
      if (companyData || ownerEmail) {
         sessionStorage.setItem('companyRegistrationData', JSON.stringify({
            companyData,
            ownerEmail,
            step: currentStep
         }))
      }
   }, [companyData, ownerEmail, currentStep])

   const submitCompanyRegistration = (data, result) => {
      setCompanyData(result)
      setOwnerEmail(data.ownerEmail)
      setCurrentStep(2)
      sessionStorage.setItem('companyRegistrationData', JSON.stringify({
         companyData: result,
         ownerEmail: data.ownerEmail,
         step: 2
      }))
      router.push('/company/verify-owner')
   }

   const verifyOwnerOtp = (result) => {
      setCurrentStep(3)
      sessionStorage.setItem('companyRegistrationData', JSON.stringify({
         companyData,
         ownerEmail,
         step: 3
      }))
      router.push('/company/confirmation')
   }

   const resetFlow = () => {
      setCompanyData(null)
      setOwnerEmail('')
      setCurrentStep(1)
      sessionStorage.removeItem('companyRegistrationData')
      router.push('/company/register')
   }

   const value = {
      companyData,
      ownerEmail,
      currentStep,
      submitCompanyRegistration,
      verifyOwnerOtp,
      resetFlow
   }

   return (
      <CompanyRegistrationContext.Provider value={value}>
         {children}
      </CompanyRegistrationContext.Provider>
   )
}

export const useCompanyRegistration = () => {
   const context = useContext(CompanyRegistrationContext)
   if (context === undefined) {
      throw new Error('useCompanyRegistration must be used within a CompanyRegistrationProvider')
   }
   return context
}