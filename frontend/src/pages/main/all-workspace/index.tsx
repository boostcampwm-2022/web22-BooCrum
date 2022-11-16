import WorkspaceList from '@pages/main/workspace-list';
import WorkspaceTemplates from '@pages/main/workspace-template-list';

function AllWorkspace() {
	return (
		<div>
			<WorkspaceTemplates />
			<WorkspaceList title="All workspace" />
		</div>
	);
}

export default AllWorkspace;
