// rent/page.jsx
import React from 'react'
import PropertiesPage from '@/app/(pages)/properties/get-all/page'

export default function Pedingapprovals() {
   return (
      <>
         <PropertiesPage
            showOnlyApproved={true}
            filterType="residential"
            filterSaleOrRent="rent"
            title="Residential Properties for Rent"
            description="Find your perfect home from our verified residential rental properties"
            showAddButton={false}
            showEditButton={false}
         />
      </>
   )
}

