// app/(pages)/properties/page.jsx
// app/(pages)/admin/all-properties/page.jsx
import PropertiesPage from './get-all/page';

const AdminAllPropertiesPage = () => {
  return (
    <PropertiesPage
      showAll={true} // Show all properties for admin management
      title="All Properties"
      description="Manage all properties in the system"
      showAddButton={false} // Admin might not need add button here
    />
  );
};

export default AdminAllPropertiesPage;