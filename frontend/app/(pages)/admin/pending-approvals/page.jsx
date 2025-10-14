// peding-approvals/page.jsx
import React from 'react'
import PropertiesPage from '@/app/(pages)/properties/get-all/page'

export default function Pedingapprovals() {
  return (
    <>
      <PropertiesPage
        showOnlyPending={true}
        title="Pending Approval"
        description="Properties waiting for administrator approval"
        showAddButton={false}
        showEditButton={true}
      />
    </>
  )
}

