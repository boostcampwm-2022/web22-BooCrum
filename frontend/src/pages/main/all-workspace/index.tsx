import WorkspaceList from '@pages/main/workspace-list';
import WorkspaceTemplates from '@pages/main/workspace-template-list';

function AllWorkspace() {
	return (
		<>
			<WorkspaceTemplates />
			<WorkspaceList title="All workspace" hasOrder />
		</>
	);
}

export default AllWorkspace;
