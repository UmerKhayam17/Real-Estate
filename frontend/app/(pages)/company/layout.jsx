// app/company/layout.jsx
import { CompanyRegistrationProvider } from '@/contexts/CompanyRegistrationContext'

export default function CompanyLayout({ children }) {
   return (
      <CompanyRegistrationProvider>
         <div className="min-h-screen">
            {children}
         </div>
      </CompanyRegistrationProvider>
   )
}