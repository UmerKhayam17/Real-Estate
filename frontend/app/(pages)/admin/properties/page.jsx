// approved-propertities/page.jsx
import React from 'react'
import PropertiesPage from '@/app/shared/properties/get-all/page'

export default function Pedingapprovals() {
   return (
      <>
         <PropertiesPage
            showOnlyApproved={true}
            title="Verified Approval"
            description="Properties that administrator approval"
            showAddButton={false}
            showEditButton={true}
         />
      </>
   )
}

