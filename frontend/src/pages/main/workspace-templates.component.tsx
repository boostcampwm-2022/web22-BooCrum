import React from 'react';
import { Container, TemplateList, Title } from './workspace-templates.style';
import WorkspaceTemplate from '@components/workspace-template';
import { templates } from '@data/workspace-templates';

function WorkspaceTemplates() {
	return (
		<Container>
			<Title>Create a workspace</Title>
			<TemplateList>
				{templates.map((template) => (
					<WorkspaceTemplate key={template.id} template={template} />
				))}
			</TemplateList>
		</Container>
	);
}

export default WorkspaceTemplates;
