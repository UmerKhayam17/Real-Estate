// commercial/page.jsx
import PropertiesPage from "@/app/(pages)/dealer/properties/get-all/page"

export default function CommercialProperties() {
   return (
      <PropertiesPage
         showOnlyApproved={true}
         filterType="commercial"
         title="Commercial Properties"
         description="Browse verified commercial properties for your business needs"
         showAddButton={false}
         showEditButton={false}
      />
   )
}