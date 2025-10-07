import PropertiesPage from "@/app/(pages)/dealer/properties/get-all/page"

export default function BuyPage() {
   return (
      <div className="min-h-screen bg-background pt-16">
         <PropertiesPage
            showOnlyApproved={true}
            title="Verified Properties"
            description="Browse through our collection of verified and approved properties"
            showAddButton={false}
            showEditButton={false}

         />
      </div>
   )
}