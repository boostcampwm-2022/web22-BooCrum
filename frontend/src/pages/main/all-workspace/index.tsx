import WorkspaceList from '@pages/main/workspace-list';
import WorkspaceTemplates from '@pages/main/workspace-template-list';
import OrderDropdown from '@components/order-dropdown';

function AllWorkspace() {
	return (
		<div>
			<WorkspaceTemplates />
			<WorkspaceList title="All workspace" />
			<OrderDropdown />
		</div>
	);
}

export default AllWorkspace;
