// app/dealer/properties/page.jsx
import PropertiesPage from '@/app/shared/properties/get-all/page';

const AllProperties = () => {
  return (
    <PropertiesPage
      showAll={true} 
      title="All Properties"
      description="Manage all properties in the system"
      showAddButton={true} 
      showEditButton={true}
    />
  );
};

export default AllProperties;