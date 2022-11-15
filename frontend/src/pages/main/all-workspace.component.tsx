import React from 'react';
import WorkspaceList from '@components/workspace-list';
import WorkspaceTemplates from './workspace-templates.component';

function AllWorkspace() {
	return (
		<div>
			<WorkspaceTemplates />
			<WorkspaceList title="All workspace" />
		</div>
	);
}

export default AllWorkspace;
