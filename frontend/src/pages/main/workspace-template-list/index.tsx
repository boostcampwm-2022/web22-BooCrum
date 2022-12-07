import { Container } from './index.style';
import WorkspaceTemplate from '@pages/main/workspace-template';
import { TemplateType } from './index.type';
import { useEffect, useState } from 'react';
import { Workspace } from '@api/workspace';

const newBoard: TemplateType = {
	templateId: '0',
	templateName: 'New board',
	templateThumbnailUrl: null,
	isNewTemplate: true,
};

function WorkspaceTemplates() {
	const [templates, setTemplates] = useState<TemplateType[]>([]);

	useEffect(() => {
		async function getTemplates() {
			const result = await Workspace.getTemplates();
			setTemplates(result);
		}

		getTemplates();
	}, []);

	return (
		<Container>
			<p className="title">Create a workspace</p>
			<WorkspaceTemplate template={newBoard} />
			<div className="template-list">
				{templates.map((template) => (
					<WorkspaceTemplate key={template.templateId} template={template} />
				))}
			</div>
		</Container>
	);
}

export default WorkspaceTemplates;
