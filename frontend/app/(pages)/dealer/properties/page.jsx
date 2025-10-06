// app/(pages)/properties/page.jsx
import PropertiesPage from './get-all/page';

const AllProperties = () => {
  return (
    <PropertiesPage
      showAll={true} 
      title="All Properties"
      description="Manage all properties in the system"
      showAddButton={false} 
      showEditButton={true}
    />
  );
};

export default AllProperties;