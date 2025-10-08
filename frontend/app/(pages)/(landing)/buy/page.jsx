// buy/page.jsx
import React from 'react'
import PropertiesPage from "@/app/shared/properties/get-all/page"

export default function BuyPage() {
   return (
      <div className="min-h-screen bg-background pt-16">
         <PropertiesPage
            showOnlyApproved={true}
            filterSaleOrRent="sale"
            title="Properties for Sale"
            description="Browse through verified properties available for purchase"
            showAddButton={false}
            showEditButton={false}
         />
      </div>
   )
}