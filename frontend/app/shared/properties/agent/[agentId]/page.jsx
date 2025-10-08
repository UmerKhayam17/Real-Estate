// app/shared/properties/agent/[agentId]/page.jsx
import PropertiesPage from '@/app/shared/properties/get-all/page';

export default function AgentProperties({ params }) {
   const { agentId } = params;

   return (
      <PropertiesPage
         filterAgentId={agentId}
         title="Agent Properties"
         description="Browse properties listed by this agent"
         showAddButton={false}
         showEditButton={false}
         hideFilters={true} // Hide filters for agent-specific view
      />
   );
}