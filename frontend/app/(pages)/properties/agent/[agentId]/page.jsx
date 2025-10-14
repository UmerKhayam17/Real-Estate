// app/shared/properties/agent/[agentId]/page.jsx
import PropertiesPage from '@/app/(pages)/properties/get-all/page';

const AgentPropertiesContent = ({ params }) => {
   const { agentId } = params;

   return (
      <PropertiesPage
         filterAgentId={agentId}
         title="Agent Properties"
         description="Browse properties listed by this agent"
         showAddButton={false}
         showEditButton={false}
         hideFilters={true}
      />
   );
};

const AgentProperties = ({ params }) => {
   return (
      <>
         <AgentPropertiesContent params={params} />
      </>
   );
};

export default AgentProperties;