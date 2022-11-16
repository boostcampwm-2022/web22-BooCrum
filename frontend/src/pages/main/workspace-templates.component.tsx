import React from 'react';
import { Container } from './workspace-templates.style';
import WorkspaceTemplate from '@components/workspace-template';
import { templates } from '@data/workspace-templates';

function WorkspaceTemplates() {
	return (
		<Container>
			<p className="title">Create a workspace</p>
			<div className="template-list">
				{templates.map((template) => (
					<WorkspaceTemplate key={template.id} template={template} />
				))}
			</div>
		</Container>
	);
}

export default WorkspaceTemplates;
